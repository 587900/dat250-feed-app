'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

@StaticImplements<IRouterClass>()
export default class PollRouter {

    public static create() : Router {
        let router = Router();

        router.get('/', (req, res) => {
            res.send('Hello!');
        });

        return router;
    }

}