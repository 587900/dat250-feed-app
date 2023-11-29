'use strict';

import Poll from '../../../common/model/poll';
import Logger from '../logger';
import Services from '../services';
import Constants from '../constants';

import EventMaster, { Event as EMEvent } from './../services/event-master';
import PollService from './../services/poll-service';

/** A daemon for automatically closing timed polls */
export default class PollTimeoutDaemon {

    private logger = Logger.getLogger('/lib/services/poll-timeout-daemon.ts');
    private interval : NodeJS.Timeout | null = null;

    private trackingPolls : Map<string, Poll> = new Map<string, Poll>();

    constructor() {
        Services.get<EventMaster>(Constants.EventMaster).addListener(async (event : EMEvent) => {
            if (event.type != 'poll') return;
            if (event.detail == 'delete') return this.trackingPolls.delete(event.code);
            if (event.detail == 'create') return this.trackPoll(event.code);
            if (event.detail == 'update') {
                this.trackingPolls.delete(event.oldCode);
                return this.trackPoll(event.code);
            }
            // Note: open and close and encapsulated by 'update'
        });

        Services.get<PollService>(Constants.PollService).all().then(polls => {
            for (let poll of polls) this.trackingPolls.set(poll.code, poll);
        });
    }

    private async trackPoll(code : string) {
        let poll = await Services.get<PollService>(Constants.PollService).find(code);
        if (poll == null) return this.logger.error(`Failed fo fetch poll with code '${code}'`);
        return this.trackingPolls.set(code, poll);
    }

    public async start() : Promise<void> {
        if (this.interval != null) return;
        this.logger.info('Starting poll timeout daemon');
        this.interval = setInterval(() => this.check(), 1000);
    }

    public async stop() : Promise<void> {
        if (this.interval == null) return;
        this.logger.info('Stopping poll timeout daemon');
        clearInterval(this.interval);
        this.interval = null;
    }

    public running() : boolean { return this.interval != null; }

    private async check() : Promise<any> {
        let now = Date.now();
        let promises : Promise<void>[] = [];
        for (let poll of this.trackingPolls.values()) {
            if (!poll.open) continue;
            if (!poll.timed) continue;
            if (poll.timeoutUnix == null) continue;
            if (poll.timeoutUnix > now) continue;
            this.logger.info(`Poll with code '${poll.code}' timed out`);
            promises.push(Services.get<PollService>(Constants.PollService).closeTimeout(poll.code).then(r => {
                if (r != 'ok') this.logger.warn(`Poll with code '${poll.code}' attempted close but failed with: ${r}`);
            }));
        }
        await Promise.all(promises);
    }

}