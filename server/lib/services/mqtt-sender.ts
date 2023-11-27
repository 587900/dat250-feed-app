'use strict';

import { KeyValuePair } from './../../../common/types';

import mqtt, { MqttClient } from 'mqtt';
import Logger from './../logger';

export default class MQTTSender {

    private logger = Logger.getLogger('/lib/services/mqtt-sender.ts');
    private client : MqttClient | null;

    constructor(url : string | null) {
        let t = (url == null ? ' NOT ' : ' ');
        this.logger.info(`Url was${t}defined. Mqtt will${t}be used.`);

        if (url == null) this.client = null; else this.client = mqtt.connect(url);
    }

    public async publish(topic : string, data : KeyValuePair<any>) : Promise<void> {
        if (this.client == null) return;
        await this.client.publishAsync(topic, JSON.stringify(data));
    }

}