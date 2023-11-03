'use strict';

import { Router } from 'express';
import IRouterClass from './../../i-router-class';
import StaticImplements from './../../../decorator/static-implements';
import passport from 'passport';

import Constants from './../../../constants';

@StaticImplements<IRouterClass>()
export default class GoogleAuthRouter {

    public static create() : Router {

        let router = Router();

        router.get('/', passport.authenticate('google', { scope: ['profile'] }));

        const success = (req, res) => res.redirect(req.cookies[Constants.SessionRedirectOnAuthSuccess] || '/');
        const failure = (req, res) => res.redirect(req.cookies[Constants.SessionRedirectOnAuthFailure] || '/login');

        router.get('/callback', (req, res, next) => passport.authenticate('google', (err, user, info, status) => {
            if (err) return next(err);
            if (!user) return failure(req, res);
            return success(req, res);
        })(req, res, next));

        return router;
    }

}