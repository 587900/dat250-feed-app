'use strict';

import { Router } from 'express';
import passport from 'passport';

import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Constants from './../../constants';
import Logger from './../../logger';

@StaticImplements<IRouterClass>()
export default class AuthRouter {

    public static create() : Router {
        let router = Router();

        router.use('/check', (req, res) => this.check(req, res));
        router.get('/logout', (req, res) => this.logout(req, res));

        // Store redirect urls middleware
        router.use((_req, res, next) => {
            let req = <any>_req;
            this.cookie(res, Constants.SessionRedirectOnAuthSuccess, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthSuccess]);
            this.cookie(res, Constants.SessionRedirectOnAuthFailure, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthFailure]);
            next();
        });

        router.use('/local', this.local());
        router.use('/google', this.basic('google'));
        router.use('/iot-device', this.crbasic('iot-device'));

        return router;
    }

    private static cookie(res, key, value) {
        if (value == null) return;
        res.cookie(key, value);
    }

    private static check(req, res) {
        let user = req.user;
        if (user == null) return res.send({ authenticated: false });
        return res.send({ authenticated: true, user, guest: user.guest });
    }

    private static logout(req, res) {
        let user = req.user;
        if (user == null) return res.send('not logged in');

        req.logout((err : Error) => {
            let logger = Logger.getLogger('/lib/rest/router/auth.ts');

            if (err) {
                logger.error(`User with id '${user.id}' failed to logout with error: ${err}`);
                return res.sendStatus(500);
            }

            if (!req.session) {
                logger.error(`User with id '${user.id}' did not have a session`);
                return res.sendStatus(500);
            }

            req.session.destroy((err : Error) => {
                if (err) {
                    logger.error(`Failed to destroy session on user with id '${user.id}'`);
                    return res.sendStatus(500);
                }

                res.clearCookie('connect.sid');
                res.send({ success: true });
            });
        });
    }

    private static local() : Router {
        let router = Router();

        router.get('/', (req, res, next) => passport.authenticate('local', this.crhandler.bind(this, req, res, next))(req, res, next));
        router.post('/register', (req, res, next) => passport.authenticate('local-register', this.crhandler.bind(this, req, res, next))(req, res, next));

        return router;
    }

    private static basic(name: string) : Router {
        let router = Router();

        router.get('/', passport.authenticate(name, { scope: ['profile'] }));
        router.get('/callback', (req, res, next) => passport.authenticate(name, this.crhandler.bind(this, req, res, next))(req, res, next));

        return router;
    }

    // 'code reason' basic
    private static crbasic(name : string) : Router {
        let router = Router();

        router.get('/', (req, res, next) => passport.authenticate(name, this.crhandler.bind(this, req, res, next))(req, res, next));

        return router;
    }

    private static crhandler(req, res, next, err, user, info) {
        if (err) {
            let { code, reason } = err;
            if (code == null || reason == null) return next(err);
            return res.status(code).send(reason);
        }

        let successRedirect = req.cookies[Constants.SessionRedirectOnAuthSuccess] || '/';
        let failureRedirect = req.cookies[Constants.SessionRedirectOnAuthFailure] || '/login';

        if (!user) return res.redirect(failureRedirect);

        req.logIn(user, err => {
            if (err) { return next(err); }
            return res.redirect(successRedirect);
        });
    }

}