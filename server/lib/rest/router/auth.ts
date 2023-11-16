'use strict';

import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import IRouterClass from './../i-router-class';
import User from '../../../../common/model/user';
import StaticImplements from './../../decorator/static-implements';

import Constants from './../../constants';

const JWT_SECRET = process.env.JWT_SECRET

@StaticImplements<IRouterClass>()
export default class AuthRouter {

    

    public static create() : Router {
        let router = Router();

        // Store redirect urls middleware
        router.use((_req, res, next) => {
            let req = <any>_req;
            this.cookie(res, Constants.SessionRedirectOnAuthSuccess, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthSuccess]);
            this.cookie(res, Constants.SessionRedirectOnAuthFailure, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthFailure]);
            next();
        });

        router.use('/google', this.basic('google'));
        router.use('/iot-device', this.crbasic('iot-device'));

        return router;
    }

    private static cookie(res, key, value) {
        if (value == null) return;
        res.cookie(key, value);
    }

    private static generateTokenForUser(user: User): string {
        if (!user || !user.id) {
            throw new Error('User data is required to generate a token');
        }
    
        const payload = {
            userId: user.id,
            // You can add additional user info here
        };
    
        const options = {
            expiresIn: '1h', // Example expiration time
            // other options can be set as needed
        };
    
        return jwt.sign(payload, JWT_SECRET, options);
    };

    private static basic(name: string) : Router {
        let router = Router();

        router.get('/', passport.authenticate(name, { scope: ['profile'] }));

        // Updated callback route
        router.get('/callback', (req, res, next) => {
            passport.authenticate(name, (err, user, info) => {
                if (err || !user) {
                    return res.redirect('http://localhost:3000/login?error=authFailed');
                }

                req.logIn(user, (err) => {
                    if (err) { return next(err); }
                    const token = this.generateTokenForUser(user); // Implement this function
                    res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });
                    return res.redirect('http://localhost:3000/');
                });
            })(req, res, next);
        });

        return router;
    }

    // 'code reason' basic
    private static crbasic(name : string) : Router {
        let router = Router();

        router.get('/', (req, res, next) => {
            let successRedirect = req.cookies[Constants.SessionRedirectOnAuthSuccess] || '/';
            let failureRedirect = req.cookies[Constants.SessionRedirectOnAuthFailure] || '/login';
            passport.authenticate(name, (err, user, info) => {
                if (err) {
                    let { code, reason } = err;
                    if (code == null || reason == null) return next(err);
                    return res.status(code).send(reason);
                }

                if (!user) return res.redirect(failureRedirect);

                req.logIn(user, err => {
                    if (err) { return next(err); }
                    return res.redirect(successRedirect);
                });

            })(req, res, next);
        });

        return router;
    }

}