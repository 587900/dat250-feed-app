'use strict';

import { Router } from 'express';
import passport from 'passport';

import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Constants from './../../constants';

@StaticImplements<IRouterClass>()
export default class AuthRouter {

    public static create() : Router {
        let router = Router();

        router.use('/check', (req, res) => {
            let user = req.user;
            if (user == null) return res.send({ authenticated: false });
            return res.send({ authenticated: true, user });
        });

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

    private static basic(name: string) : Router {
        let router = Router();

        router.get('/', passport.authenticate(name, { scope: ['profile'] }));

        router.get('/callback', (req, res, next) => {
            let successRedirect = req.cookies[Constants.SessionRedirectOnAuthSuccess] || '/';
            let failureRedirect = req.cookies[Constants.SessionRedirectOnAuthFailure] || '/login';
            passport.authenticate(name, { successRedirect, failureRedirect })(req, res, next);
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