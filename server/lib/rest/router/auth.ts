'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import GoogleAuthRouter from './auth/google-auth';

@StaticImplements<IRouterClass>()
export default class UserRouter {

    public static create() : Router {
        let router = Router();
        router.use('/google', GoogleAuthRouter.create());
        return router;
    }

}