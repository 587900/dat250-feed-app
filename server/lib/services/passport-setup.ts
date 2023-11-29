'use strict';

import { IncomingMessage } from 'http';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as CustomStrategy } from 'passport-custom';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from './../../../common/model/user';

import AuthService from './auth-service';

import Services from './../services';
import Config from './../config';
import Constants from './../constants';

export default class PassportSetup {

    constructor() {}

    public setup(baseUrl : string = 'http://localhost:8080') {
        while (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        let auth = Services.get<AuthService>(Constants.AuthService);

        passport.serializeUser((user: User, done) => done(null, user.id));
        passport.deserializeUser(async (id: string, done) => done(null, await auth.getUserById(id)));

        passport.use('local-guest', new CustomStrategy(async (req: IncomingMessage, cb) => {
            let id = (<any>req).cookies['connect.sid'];

            let user = await auth.getUserByLocalGuestId(id);
            if (user == null) {
                let uid = Math.floor(Math.random() * 1000000);
                user = await auth.create('Guest', `${uid}`, [ 'web-user-guest' ], `guest-${uid}`, true);
                if (user == null) return cb('failed to create guest account', null);
                let success = await auth.linkLocalGuestAccount(user.id, id);
                if (!success) {
                    auth.delete(user.id);
                    return cb('failed to link guest account', null);
                }
            }
            auth.notifyLogin(user.id, 'local-guest');
            return cb(null, user);
        }));

        passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, cb) => {
            let user = await auth.getUserByLocalId(email);
            if (user == null) return cb({ code: 404, reason: 'Wrong username or password' }, null);

            let success = await auth.verifyLocalUserPassword(email, password);
            if (!success) return cb({ code: 404, reason: 'Wrong username or password' }, null);

            auth.notifyLogin(user.id, 'local');
            return cb(null, user);
        }));

        passport.use('local-register', new CustomStrategy(async (req: IncomingMessage, cb) => {
            let data = (<any>req).bodyQuery;
            if (data == null) return cb({ code: 500, reason: 'Internal server error' }, null);

            let missing : string[] = [];
            if (data.email == null) missing.push('email');
            if (data.password == null) missing.push('password');
            if (data.firstName == null) missing.push('firstName');
            if (data.lastName == null) missing.push('lastName');
            if (missing.length > 0) return cb({ code: 400, reason: `Missing parameter(s): ${missing}` }, null);
            let { email, password, firstName, lastName } = <{ email : string, password : string, firstName : string, lastName : string } >data;

            let user = await auth.getUserByLocalId(email);
            if (user != null) return cb({ code: 409, reason: 'User already exists' }, null);

            user = await auth.create(firstName, lastName, [ 'web-user' ], email, false);
            if (user == null) return cb({ code: 500, reason: 'Internal server error' }, null);

            let success = await auth.linkLocalAccount(user.id, email, password);
            if (!success) {
                auth.delete(user.id);
                return cb({ code: 500, reason: 'Internal server error' }, null);
            }

            auth.notifyLogin(user.id, 'local');
            return cb(null, user);
        }));

        passport.use('google', new GoogleStrategy({
            clientID: Config.auth.googleClientID,
            clientSecret: Config.auth.googleClientSecret,
            callbackURL: baseUrl + '/auth/google/callback'
            }, async (accessToken, refreshToken, profile, cb) => {
                let user = await auth.getUserByGoogleId(profile.id);
                if (user == null) {
                    user = await auth.create(profile.name.givenName, profile.name.familyName, [ 'web-user' ], profile.name.givenName + ' ' + profile.name.familyName, false);
                    if (user == null) return cb('failed to create account, username already exists', null);
                    let success = await auth.linkGoogleAccount(user.id, profile.id);
                    if (!success) {
                        auth.delete(user.id);
                        return cb('failed to link google account', null);
                    }
                }
                auth.notifyLogin(user.id, 'google');
                return cb(null, user);
            }
        ));

        passport.use('iot-device', new CustomStrategy(async (req: IncomingMessage, cb) => {
            let token = req.headers.authorization;
            if (token == null) return cb({ code: 400, reason: 'no token provided' }, null);

            let [ scheme, credential ] = token.split(' ');
            if (scheme == null || credential == null) return cb({ code: 400, reason: 'invalid format, should be: Authorization: <scheme> <token>' }, null);

            if (scheme != 'Bearer') return cb({ code: 400, reason: 'invalid scheme, supported: Bearer' }, null);

            let user = await auth.getUserByIOTToken(credential);
            if (user == null) return cb({ code: 404, reason: 'no user found for given token' }, null);
            auth.notifyLogin(user.id, 'iot-device');
            return cb(null, user);
        }));
    }

}