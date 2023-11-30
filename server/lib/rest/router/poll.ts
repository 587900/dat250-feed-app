'use strict';

import { Router } from 'express';
import IRouterClass from './../i-router-class';
import StaticImplements from './../../decorator/static-implements';

import Services from './../../services';
import Constants from './../../constants';
import PollService from './../../services/poll-service';
import VoteService from './../../services/vote-service';

import Util from './../util';

import Logger from './../../logger';
import { VoteSelection } from '../../../../common/model/vote';
import { KeyValuePair } from '../../../../common/types';

@StaticImplements<IRouterClass>()
export default class PollRouter {

    public static create() : Router {

        let logger = Logger.getLogger('/lib/rest/router/poll.ts');
        let router = Router();

        const polls = Services.get<PollService>(Constants.PollService);
        const votes = Services.get<VoteService>(Constants.VoteService);

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
            if (user.guest) return res.status(403).send('Guests cannot create polls');

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

        router.put('/:code', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let result = await polls.safeParsePartial(req.bodyQuery, user.claims.includes('admin'));
            if (!result.success) return res.status(400).send(result.error);

            let poll = result.data;

            let code = req.params['code'];
            let status = await polls.updateAs(code, poll, user);

            if (status != 'ok') logger.debug(`User with id '${user.id}' tried updating poll with code '${code}' but failed with: '${status}'`)

            if (status == 'no-poll') return res.sendStatus(404);
            if (status == 'permissions') {
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' updated poll with code '${code}'${poll.code != code ? ` (new code: '${poll.code}')` : ''}`);

            return res.send(poll);
        });

        router.get('/:code/vote', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            let code = req.params['code'];

            let result = await votes.find({ pollCode: code, userId: user.id });
            if (result == null) return res.sendStatus(404);

            return res.send(result);
        });

        router.post('/:code/vote', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            if (!user.claims.includes('regular-voter')) {
                logger.debug(`User with id '${user.id}' attempted to do vote but failed because they were missing the regular-voter claim`);
                return res.status(403).send('You are missing permissions to vote using the \'regular-voter\' voting mechanism');
            }

            let proceed = Util.respondIfMissing(req.bodyQuery, ['selection'], res);
            if (!proceed) return;

            let code = req.params['code'];
            let { selection } = <{ selection: string }>req.bodyQuery;
            selection = selection.toLowerCase();

            let result = await polls.vote(code, user, selection as VoteSelection);
            if (!result.success) {
                if (result.reason == 'no-poll') return res.sendStatus(404);
                if (result.reason == 'invalid-selection') return res.status(400).send(`Invalid value for 'selection': ${selection}`);
                if (result.reason == 'permissions') return res.status(403).send('You do not have permission to vote on this poll');
                //if (result.reason == 'permissions') return res.sendStatus(404);
                return res.sendStatus(500);
            }

            logger.info(`User with id '${user.id}' voted on poll with code '${code}' (selection: ${selection}, changed: ${result.changed})`);

            return res.send(result.vote);
        });

        router.get('/:code/iot-vote', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            //let code = req.params['code'];

            //let result = await iotvotes.find({ pollCode: code, userId: user.id });
            let result = null;
            if (result == null) return res.sendStatus(404);

            return res.send(result);
        });

        router.post('/:code/iot-vote', async (req, res) => {
            let user = req.user;
            if (!user) return res.status(401).send('You must be logged in');

            if (!user.claims.includes('iot-device')) {
                logger.debug(`User with id '${user.id}' attempted to do iot-vote but failed because they were missing the iot-vote claim`);
                return res.status(403).send('You are missing permissions to vote using the \'iot-device\' voting mechanism');
            }

            let proceed = Util.respondIfMissing(req.bodyQuery, ['selections'], res);
            if (!proceed) return;

            let code = req.params['code'];
            let { selections } = <{ selections: KeyValuePair<string> }>(<unknown>req.bodyQuery);
            for (let v of Object.values(selections)) {
                if (isNaN(Number(v))) return res.status(400).send('All selections must corrolate a selection with a number');
            }

            // TODO: not implemented - consider replacing 'status' with { status: true, IoTVote } | { status: false, reason }
            //let status = await polls.iotvote(code, user, selections);
            let status : 'ok' | 'no-poll' | 'invalid-selection' | 'permissions' = <'ok' | 'no-poll' | 'invalid-selection' | 'permissions'>(['ok'][0]);

            if (status != 'ok') logger.debug(`User with id '${user.id}' tried iot-vote with code '${code}' but failed with: '${status}'`);

            if (status == 'no-poll') return res.sendStatus(404);
            if (status == 'invalid-selection') return res.status(400).send('one of the selections do not exist on the poll');
            if (status == 'permissions') {
                let poll = await polls.find(code);
                if (poll != null && polls.canUserSee(poll, user)) return res.sendStatus(403);
                return res.sendStatus(404);
            }

            logger.info(`User with id '${user.id}' successfully did iot-vote with code '${code}', selections: ${selections}`);

            return res.send('ok');
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