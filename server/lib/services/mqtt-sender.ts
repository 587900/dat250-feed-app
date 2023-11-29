'use strict';

import { KeyValuePair } from './../../../common/types';
import { Event as EMEvent } from './event-master';

import mqtt, { MqttClient } from 'mqtt';
import Logger from './../logger';
import Services from './../services';
import Constants from './../constants';

import EventMaster from './event-master';

export default class MQTTSender {

    private logger = Logger.getLogger('/lib/services/mqtt-sender.ts');
    private client : MqttClient;

    constructor(url : string) {
        this.client = mqtt.connect(url);

        Services.get<EventMaster>(Constants.EventMaster).addListener(async (event : EMEvent) => {
            if (event.type != 'poll') return;

            let topic = `poll-${event.code}`;
            let data : KeyValuePair<any> = { code: event.code, type: event.detail, totalVotes: event.totalVotes };
            if (event.detail == 'vote') data.selection = event.selection;
            this.publish(topic, data);
        });
    }

    public async publish(topic : string, data : KeyValuePair<any>) : Promise<void> {
        this.logger.debug(`Publishing to topic '${topic}' with data: ${JSON.stringify(data)}`);
        await this.client.publishAsync(topic, JSON.stringify(data));
    }

}