'use strict';

import { VoteSelection } from './../../../common/model/vote';
import { KeyValuePair, KeyToValue } from './../../../common/types';

import Logger from './../logger';

import Services from './../services';
import MQTTSender from './mqtt-sender';
import Constants from './../constants';

/** Receives events from various points in the application. */
export default class EventMaster {

    private logger = Logger.getLogger('/lib/services/event-master.ts');

    constructor() {}

    public async submit(event : Event) : Promise<void> {
        let promises : Promise<any>[] = [];
        promises.push(this.handleMqtt(event));

        await Promise.all(promises);
    }

    private async handleMqtt(event : Event) : Promise<void> {
        let mqtt = Services.get<MQTTSender>(Constants.MQTTSender);
        switch (event.type) {
            case 'poll':
                let topic = `poll-${event.code}`
                let data : KeyValuePair<any> = { code: event.code, type: event.detail, totalVotes: event.totalVotes };
                if (event.detail == 'vote') data.selection = event.selection;
                mqtt.publish(topic, data);
                break;
            default: this.logger.error(`unknown event type: ${event.type}`); break;
        }
    }

}

type EventPoll = { type: 'poll', code : string, totalVotes: KeyToValue<VoteSelection, number> }
                & ({ detail: 'open' | 'close' | 'create' | 'delete' } | { detail: 'vote', selection : VoteSelection });

export type Event = EventPoll;