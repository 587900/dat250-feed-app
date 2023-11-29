'use strict';

import fetch from 'node-fetch';

import { KeyValuePair } from '../../../common/types';

import Services from './../services';
import Constants from './../constants';
import Config from './../config'
import EventMaster, { Event as EMEvent } from './event-master';
import PollService from './poll-service';

import Logger from './../logger';

export default class DweetSender {

    private logger = Logger.getLogger('/lib/services/dweet-sender.ts');

    constructor () {
        Services.get<EventMaster>(Constants.EventMaster).addListener(async (event : EMEvent) => {
            if (event.type != 'poll') return;
            if (event.detail != 'open' && event.detail != 'close') return;

            let poll = await Services.get<PollService>(Constants.PollService).find(event.code);
            if (poll == null) return;

            this.send({ title: poll.title, description: poll.description, code: poll.code, votes: poll.cachedVotes, open: poll.open }, Config.dweetPrefix + poll.code);
        });
    }

    /** Dweet some data, returning the GET-url to request the data back (assuming it is not overwritten). */
    public async send(data : KeyValuePair<any>, title : string) : Promise<string> {
        let options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } };
        await fetch(`https://dweet.io/dweet/for/${title}`, options).catch(err => this.logger.error(err));
        return `https://dweet.io/get/latest/dweet/for/${title}`;
    }

}