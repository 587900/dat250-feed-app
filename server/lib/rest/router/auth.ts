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
            this.cookie(res, Constants.SessionRedirectOnAuthSuccess, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthSuccess]);
            this.cookie(res, Constants.SessionRedirectOnAuthFailure, req.bodyQuery[Constants.WebParamSessionRedirectOnAuthFailure]);
            next();
        });

        router.use('/google', GoogleAuthRouter.create());

        return router;
    }

    private static cookie(res, key, value) {
        if (value == null) return;
        res.cookie(key, value);
    }

}