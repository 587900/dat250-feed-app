'use strict';

import Logger from './logger';

export default class Daemons {

    private static daemons : Map<string, Daemon> = new Map();

    public static add(key : string, value : Daemon) {
        if (this.daemons.get(key) != null) Logger.getLogger('/lib/daemons.ts').warn(`key: ${key} already exists. replacing...`);
        this.daemons.set(key, value);
    }

    public static getOrUndefined<T extends Daemon>(key : string) : T | undefined {
        return <T>this.daemons.get(key);
    }

    public static get<T extends Daemon>(key : string) : T {
        let s = this.daemons.get(key);
        if (s != null) return <T>s;

        Logger.getLogger('/lib/daemons.ts').error(`Daemon: '${key}' was not found`);
        throw new Error(`Daemon: '${key}' was not found`);
    }

    public static has(key : string) : boolean {
        return this.daemons.get(key) != null;
    }

    public static count() : number {
        return this.daemons.size;
    }

    public static async startAll() : Promise<void> {
        let promises : Promise<void>[] = [];
        for (let daemon of this.daemons.values()) {
            if (daemon.running()) continue;
            promises.push(daemon.start());
        }
        await Promise.all(promises);
    }

    public static async stopAll() : Promise<void> {
        let promises : Promise<void>[] = [];
        for (let daemon of this.daemons.values()) {
            if (!daemon.running()) continue;
            promises.push(daemon.stop());
        }
        await Promise.all(promises);
    }

}

export interface Daemon {
    start() : Promise<void>;
    stop() : Promise<void>;
    running() : boolean;
}