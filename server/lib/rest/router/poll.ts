'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Util from './../util';

import Poll from './../../../../common/model/poll';

import Logger from './../../logger';

@StaticImplements<IRouterClass>()
export default class PollRouter {

    public static create() : Router {

        let logger = Logger.getLogger('/lib/rest/router/poll.ts');
        let router = Router();

        router.get('/:id', (req : any, res) => {
            if (!req.user) return res.status(401).send('You must be logged in');

            // p = polls.find(id);
            let p : any = { code: '123', ownerId: 'not-implemented', creationUnix: 0, open: true,
            title: 'Test poll', description: 'empty', cachedVotes: { green: 0, red: 0 }, timed: false, private: true,
            allowedVoters: [ 'web-user' ], whitelist: [ 'not-implemented' ]};

            // must be allowed to vote by type if poll is public
            if (!p.private) {
                let isAllowedVoter = false;
                for (let claim of req.user.claims) {
                    if (p.allowedVoters.includes(claim)) { isAllowedVoter = true; break; }
                }
                if (!isAllowedVoter) {
                    logger.debug(`User with id '${req.user.id}' tried accessing poll with code '${p.code}' but was missing claims`);
                    return res.sendStatus(404);
                }
            }

            // must be whitelisted if poll is private
            if (p.private && !p.whitelist.includes(req.user.id)) {
                logger.debug(`User with id '${req.user.id}' tried accessing poll with code '${p.code}' but was not whitelisted (poll was private)`);
                return res.sendStatus(404);
            }

            return res.send(p);
        });

        router.post('/', (req : any, res) => {
            if (!req.user) return res.status(401).send('You must be logged in');

            let p : Poll = { code: '123', ownerId: 'not-implemented', creationUnix: 0, open: true,
            title: 'Test poll', description: 'empty', cachedVotes: { green: 0, red: 0 }, timed: false, private: false,
            allowedVoters: [ 'web-user' ]};

            // polls.create(p);
            logger.info(`User with id '${req.user.id}' created a new poll with code '${p.code}'`);

            return res.send(p);
        });

        router.put('/:id', (req : any, res) => {
            if (!req.user) return res.status(401).send('You must be logged in');

            let id = req.param['id'];
            //let data = polls.safeParse(req.bodyQuery, admin = true);

            // polls.update(id, data);
            logger.info(`User with id '${req.user.id}' updated poll with code '${id}'`);

            return res.send('ok');
        });

        router.post('/:id/vote', (req : any, res) => {
            if (!req.user) return res.status(401).send('You must be logged in');

            let proceed = Util.respondIfMissing(req.bodyQuery, ['selection'], res);
            if (!proceed) return;

            let id = req.params['id'];
            let { selection } = <{ selection: string }>req.bodyQuery;
            selection = selection.toLowerCase();

            // polls.isValidVoteSelection(p, selection);
            if (['green', 'red'].includes(selection)) return res.status(400).send(`Invalid value for 'selection': ${selection}`);

            // let change = polls.vote(id, selection)
            let change = true;
            logger.info(`User with id '${req.user.id}' voted on poll with code '${id}' (selection: ${selection})`);

            return res.send(change ? 'changed' : 'unchanged');
        });

        router.delete('/:id', (req : any, res) => {
            if (!req.user) return res.status(401).send('You must be logged in');

            let p = { code: '123', ownerId: 'not-implmented' }; // polls.find(id);

            let access = req.user.claims.includes('admin') || req.user.id == p.ownerId;
            if (!access) {
                logger.warn(`User with id '${req.user.id}' attempted to delete poll with code '${p.code}' but was missing permissions`);
                return res.sendStatus(404); // TODO: if 'can see poll' then 403 instead
            }

            // polls.delete(p);
            logger.info(`User with id '${req.user.id}' deleted the poll with code '${p.code}'`);

            return res.send('ok');
        });

        return router;
    }

}