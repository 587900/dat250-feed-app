'use strict';

import fetch from 'node-fetch';

import { KeyValuePair } from '../../../common/types';

import Logger from './../logger';

export default class DweetSender {

    private logger = Logger.getLogger('/lib/services/dweet-sender.ts');

    constructor () {}

    /** Dweet some data, returning the GET-url to request the data back (assuming it is not overwritten). */
    public async send(data : KeyValuePair<any>, title : string) : Promise<string> {
        let options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } };
        await fetch(`https://dweet.io/dweet/for/${title}`, options).catch(err => this.logger.error(err));
        return `https://dweet.io/get/latest/dweet/for/${title}`;
    }

}