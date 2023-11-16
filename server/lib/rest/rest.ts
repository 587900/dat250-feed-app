'use strict';

import http from 'http';
import Config from './../config';

const cors = require('cors');

import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as Middlewares from './middleware/generic';
import bodyQuery from './middleware/body-query';
import passport from 'passport';

import UserRouter from './user-router';
import AuthRouter from './router/auth';
import PollRouter from './router/poll';

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
        app.use(cors({
            origin: 'http://localhost:3000' 
        }));

        app.use(passport.initialize());
        app.use(passport.session());
        app.get('/api/user/authState', (req, res) => {
            if (req.isAuthenticated()) {
                res.json({ isAuthenticated: true, user: req.user });
            } else {
                res.json({ isAuthenticated: false });
            }
        });

        this.router = express.Router();
        let router = this.router;
        app.use('/', router);

        router.get('/', (req, res) => res.send('Welcome to our feed-app!'));
        router.use('/auth', AuthRouter.create());
        router.use('/api/user', UserRouter.create());
        router.use('/api/resource/poll', PollRouter.create());

        app.use(Middlewares._404());

        app.use(Middlewares.error_handler('rest'));

    }

    public getRouter() : express.Router {
        return this.router;
    }

    public listener() : RequestListener { return this.app; }

}