'use strict';

import passport from 'passport';
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
        passport.deserializeUser((id: string, done) => done(null, auth.getUserById(id)));

        passport.use(new GoogleStrategy({
            clientID: Config.auth.googleClientID,
            clientSecret: Config.auth.googleClientSecret,
            callbackURL: baseUrl + '/auth/google/callback'
            }, (accessToken, refreshToken, profile, cb) => {
                let user: User = auth.getUserByGoogleId(profile.id);
                auth.notifyLogin(user.id, 'google');
                return cb(null, user);
            }
        ));
    }

}