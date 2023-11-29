'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Services from './../../services';
import Constants from './../../constants';
import UserService from './../../services/user-service';

import Logger from './../../logger';

@StaticImplements<IRouterClass>()
export default class UserRouter {

    public static create() : Router {

        let logger = Logger.getLogger('/lib/rest/router/user.ts');
        let router = Router();

        const users = Services.get<UserService>(Constants.UserService);

        router.get('/get-usernames', async (req, res) => {
            let prefix = req.bodyQuery['regex'] || '.*';
            let u = await users.getUsernames(prefix, false);
            logger.info(`User did fetch of usernames with prefix '${prefix}' and got '${u.length}' results.`);
            res.send(u);
        });

        return router;
    }

}