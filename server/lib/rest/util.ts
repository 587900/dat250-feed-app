'use strict';

import express from 'express';
import { KeyValuePair } from './../types';

export default class Util {

    public static getBodyQuery(req : express.Request, throwErrOnFail : boolean = true) : KeyValuePair<string> {
        let bodyQuery = (<any>req).bodyQuery;
        if (bodyQuery == null && throwErrOnFail) throw new Error(`request missing bodyQuery for url: ${req.originalUrl}`);
        return bodyQuery;
    }

    public static getMissingParameters(parameters : KeyValuePair<string>, obligatory : string[]) : string[] {
        return obligatory.filter(o => parameters[o] == null);
    }

    /** @returns true if the request should be handled by callee (callee should proceed), or false if response was sent here. */
    public static respondIfMissing(parameters : KeyValuePair<string>, obligatory : string[], res : express.Response) : boolean {
        let missing = this.getMissingParameters(parameters, obligatory);
        if (missing.length != 0) res.status(422).send(`Missing parameter(s): ${missing}`);
        return missing.length == 0;
    }

}