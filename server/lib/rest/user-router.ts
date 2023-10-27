'use strict';

import { Router } from 'express';
//import Constants from './../constants';
//import Services from './../services';
import IRouterClass from './i-router-class';
import StaticImplements from './../decorator/static-implements';
//import Util from './util';
//import Logger from './../logger';

@StaticImplements<IRouterClass>()
export default class UserRouter {

    public static create() : Router {

        //let logger = Logger.getLogger('/lib/rest/user-router.ts');
        let router = Router();

        router.get('/test', (req, res) => {
            res.send('YOOOOOOOOO');
        });

        router.post('/register', async (req, res) => {
            /*
            let bodyQuery = Util.getBodyQuery(req);
            let proceed = Util.respondIfMissing(bodyQuery, ['email', 'password'], res);
            if (!proceed) return;

            let { email, password } = <{ email: string, password: string }>bodyQuery;
            email = email.toLowerCase();

            let accounts = Services.get<AccountSystem>(Constants.AccountSystem);
            let token = await accounts.register(email, password);

            if (token.code == 201) logger.info(`Created new user with email: '${email}'`);
            else                   logger.info(`Tried to create new user for email: '${email}', but failed with code: ${token.code}, reason: ${token.reason}`);

            switch (token.code) {
                case 201: return res.status(201).send(token.value);
                case 409: return res.status(409).send('user already exists');
                case 500: return res.sendStatus(500);
                default: logger.error(`/register unhandled code: ${token.code}. sending 500.`); return res.sendStatus(500);
            }
            */
            res.send('Not implemented');
        });

        router.post('/login', async (req, res) => {
            /*
            let bodyQuery = Util.getBodyQuery(req);
            let proceed = Util.respondIfMissing(bodyQuery, ['email', 'password'], res);
            if (!proceed) return;

            let { email, password } = <{ email: string, password: string }>bodyQuery;
            email = email.toLowerCase();

            let accounts = Services.get<AccountSystem>(Constants.AccountSystem);
            let token = await accounts.login(email, password);

            if (token.code == 200) logger.info(`User logged in with email: '${email}'`);
            else                   logger.info(`User attempted to log in with email: '${email}', but failed with code: ${token.code}, reason: ${token.reason}`);

            switch (token.code) {
                case 200: return res.status(200).send(token.value);
                case 404: return res.status(404).send('incorrect email or password');
                case 500: return res.sendStatus(500);
                default: logger.error(`/login unhandled code: ${token.code}. sending 500.`); return res.sendStatus(500);
            }
            */
            res.send('Not implemented');
        });

        return router;
    }

}