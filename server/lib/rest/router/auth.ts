'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import GoogleAuthRouter from './auth/google-auth';

import Constants from './../../constants';

@StaticImplements<IRouterClass>()
export default class AuthRouter {

    public static create() : Router {
        let router = Router();

        // Store redirect urls middleware
        router.use((_req, res, next) => {
            let req = <any>_req;
            res.cookie(Constants.SessionRedirectOnAuthSuccess, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthSuccess]);
            res.cookie(Constants.SessionRedirectOnAuthFailure, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthFailure]);
            console.log('auth router', req.cookies[Constants.SessionRedirectOnAuthSuccess], req.bodyQuery[Constants.WebParamSessionRedirectOnAuthSuccess]);
            next();
        });

        router.use('/google', GoogleAuthRouter.create());
        return router;
    }

}