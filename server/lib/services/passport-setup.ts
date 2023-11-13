'use strict';

import { IncomingMessage } from 'http';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as CustomStrategy } from 'passport-custom';

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

        passport.use(new GoogleStrategy({
            clientID: Config.auth.googleClientID,
            clientSecret: Config.auth.googleClientSecret,
            callbackURL: baseUrl + '/auth/google/callback'
            }, async (accessToken, refreshToken, profile, cb) => {
                let user = await auth.getUserByGoogleId(profile.id);
                if (user == null) {
                    user = await auth.create(profile.name.givenName, profile.name.familyName, [ 'web-user' ]);
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