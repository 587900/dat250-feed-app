'use strict';

import Logger from './logger';

export default class Services {

    private static services : Map<string, object> = new Map();

    public static add(key : string, value : object) {
        if (this.services.get(key) != null) Logger.getLogger('/lib/services.ts').warn(`key: ${key} already exists. replacing...`);
        this.services.set(key, value);
    }

    public static getOrUndefined<T>(key : string) : T | undefined {
        return <T>this.services.get(key);
    }

    public static get<T>(key : string) : T {
        let s = this.services.get(key);
        if (s != null) return <T>s;

        Logger.getLogger('/lib/services.ts').error(`Service: '${key}' was not found`);
        throw new Error(`Service: '${key}' was not found`);
    }

    public static has(key : string) : boolean {
        return this.services.get(key) != null;
    }

    public static count() : number {
        return this.services.size;
    }

}