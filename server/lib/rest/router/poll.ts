'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Services from './../../services';
import Constants from './../../constants';
import PollService from './../../services/poll-service';

import Util from './../util';

import Logger from './../../logger';
import { VoteSelection } from '../../../../common/model/vote';

@StaticImplements<IRouterClass>()
export default class PollRouter {

    public static create() : Router {

        let logger = Logger.getLogger('/lib/rest/router/poll.ts');
        let router = Router();

        const polls = Services.get<PollService>(Constants.PollService);

        router.get('/', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let filter = req.bodyQuery.filter || '';

            let match = (filter == 'mine' ? { ownerId: user.id } : {});
            let collection = await polls.collect(match);
            let filtered = collection.filter(p => polls.canUserSee(p, user!));

            return res.send(filtered);
        });

        router.get('/:code', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            let poll = await polls.find(code);
            if (poll == null) return res.sendStatus(404);

            let canSee = polls.canUserSee(poll, user);
            if (!canSee) {
                logger.debug(`User with id '${user.id}' tried accessing poll with code '${poll.code}' but was missing permissions`);
                return res.sendStatus(404);
            }

            return res.send(poll);
        });

        router.post('/', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let result = await polls.safeParse(req.bodyQuery, user.id);
            if (!result.success) {
                if (result.error) return res.status(400).send(result.error);
                return res.status(400).send(`Missing fields: ${result.missing.join(', ')}`);
            }

            let poll = result.data;

            let success = await polls.create(poll);
            if (!success) {
                logger.info(`User with id '${user.id}' attempted to create a new poll with code '${poll.code}', but failed because the code was taken`);
                return res.status(409).send(`poll code '${poll.code}' already exists`);
            }

            logger.info(`User with id '${user.id}' created a new poll with code '${poll.code}'`);

            return res.send(poll);
        });

        router.post('/:code/dweet', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            let status = await polls.dweet(code, user);

            if (status != 'ok') logger.debug(`User with id '${user.id}' tried dweeting poll with code '${code}' but failed with: '${status}'`)

            if (status == 'no-poll') return res.sendStatus(404);
            if (status == 'permissions') {
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' dweeted poll with code '${code}'`);

            return res.send('ok');
        });

        router.put('/:code', (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            //let data = await polls.safeParse(req.bodyQuery, user.id);

            // TODO: check admin or owner
            logger.warn(`poll update is not implemented`);

            // polls.update(id, data);
            logger.info(`User with id '${user.id}' updated poll with code '${code}'`);

            return res.send('ok');
        });

        router.post('/:code/vote', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let proceed = Util.respondIfMissing(req.bodyQuery, ['selection'], res);
            if (!proceed) return;

            let code = req.params['code'];
            let { selection } = <{ selection: string }>req.bodyQuery;
            selection = selection.toLowerCase();

            let result = await polls.vote(code, user, selection as VoteSelection);
            if (!result.success) {
                if (result.reason == 'no-poll') return res.sendStatus(404);
                if (result.reason == 'invalid-selection') return res.status(400).send(`Invalid value for 'selection': ${selection}`);
                //if (result.reason == 'permissions') return res.status(403).send('You do not have permission to vote on this poll');
                if (result.reason == 'permissions') return res.sendStatus(404);
                return res.sendStatus(500);
            }

            logger.info(`User with id '${user.id}' voted on poll with code '${code}' (selection: ${selection})`);

            return res.send(result.vote);
        });

        router.put('/:code/close', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            let status = await polls.close(code, user);

            if (status != 'ok') logger.debug(`User with id '${user.id}' tried closing poll with code '${code}' but failed with: '${status}'`)

            if (status == 'no-poll') return res.sendStatus(404);
            if (status == 'permissions') {
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' closed the poll with code '${code}'`);
            return res.send('ok');
        });

        router.put('/:code/open', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            let status = await polls.open(code, user);

            if (status != 'ok') logger.debug(`User with id '${user.id}' tried opening poll with code '${code}' but failed with: '${status}'`)

            if (status == 'no-poll') return res.sendStatus(404);
            if (status == 'permissions') {
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' opened the poll with code '${code}'`);
            return res.send('ok');
        });

        router.delete('/:code', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];
            let success = await polls.delete(code, user);

            if (!success) {
                logger.warn(`User with id '${user.id}' attempted to delete poll with code '${code}' but failed`);
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' deleted the poll with code '${code}'`);
            return res.send('ok');
        });

        return router;
    }

}