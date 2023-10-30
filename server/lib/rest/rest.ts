'use strict';

import http from 'http';
import Config from './../config';

import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as Middlewares from './middleware/generic';
import bodyQuery from './middleware/body-query';

import UserRouter from './user-router';
import AuthRouter from './router/auth';

type RequestListener = http.RequestListener<typeof http.IncomingMessage, typeof http.ServerResponse>;

export default class REST {

    private app : express.Express;
    private router : express.Router;

    constructor() {
        this.app = express();
        let app = this.app;

        app.use(cookieParser());
        app.use(session({ secret: Config.sessionSecret, resave: true, saveUninitialized: true }));
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(bodyQuery());

        this.router = express.Router();
        let router = this.router;
        app.use('/', router);

        router.use('/auth', AuthRouter.create());
        router.use('/api/user', UserRouter.create());

        app.use(Middlewares._404());

        app.use(Middlewares.error_handler('rest'));

    }

    public getRouter() : express.Router {
        return this.router;
    }

    public listener() : RequestListener { return this.app; }

}