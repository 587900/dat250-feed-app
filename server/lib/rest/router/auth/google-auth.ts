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

        router.get('/callback', (req, res, next) => {
            let successRedirect = req.cookies[Constants.SessionRedirectOnAuthSuccess] || '/';
            let failureRedirect = req.cookies[Constants.SessionRedirectOnAuthFailure] || '/login';
            passport.authenticate('google', { successRedirect, failureRedirect })(req, res, next);
        });

        return router;
    }

}