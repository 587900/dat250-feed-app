'use strict';

import { Router } from 'express';
import IRouterClass from './../../i-router-class';
import StaticImplements from './../../../decorator/static-implements';
import passport from 'passport';

@StaticImplements<IRouterClass>()
export default class GoogleAuthRouter {

    public static create() : Router {

        let router = Router();

        router.get('/', passport.authenticate('google', { scope: ['profile'] }));

        const pauth = passport.authenticate('google', { failureRedirect: '/login' });
        router.get('/callback', pauth, (req, res) => res.redirect('/')); // redirect = success

        return router;

    }

}