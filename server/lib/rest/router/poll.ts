'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

@StaticImplements<IRouterClass>()
export default class PollRouter {

    public static create() : Router {
        let router = Router();

        router.get('/:id', (req, res) => {
            res.send(req.params.id);
        });

        router.post('/', (req, res) => {

        });

        router.put('/:id', (req, res) => {

        });

        router.post('/:id/vote', (req, res) => {

        });

        router.delete('/:id', (req, res) => {

        });

        return router;
    }

}