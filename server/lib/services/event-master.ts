'use strict';

import { VoteSelection } from './../../../common/model/vote';
import { KeyToValue } from './../../../common/types';

import Logger from './../logger';

/** Receives events from various points in the application. */
export default class EventMaster {

    private logger = Logger.getLogger('/lib/services/event-master.ts');
    private listeners : ((event : Event) => Promise<any>)[] = [];

    constructor() {}

    public addListener(listener : (event : Event) => Promise<any>) {
        this.logger.debug('Adding event listener');
        this.listeners.push(listener);
    }

    public async submit(event : Event) : Promise<void> {
        let promises : Promise<any>[] = [];
        for (let listener of this.listeners) promises.push(listener(event));
        await Promise.all(promises);
    }

}

type EventPoll = { type: 'poll', code : string, totalVotes: KeyToValue<VoteSelection, number> }
                & ({ detail: 'open' | 'close' | 'create' | 'delete' } | { detail: 'vote', selection : VoteSelection } | { detail: 'update', oldCode : string, changed : string[] });

export type Event = EventPoll;