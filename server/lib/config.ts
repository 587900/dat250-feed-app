'use strict';

/** Defines configuration based on environment variables (process.env) */

let isProduction = (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'development');

if (process.env.db_url == null) throw new Error(`IllegalArgumentException environment variable 'db_url' must be set (was not set)`);
let dbUrl = <string>process.env.db_url;

let port = Number(process.env.port);
if (isNaN(port)) throw new Error(`IllegalArgumentException environment variable 'port' must be a number. Got ${process.env.port}`);

export default {
    isProduction, dbUrl, port
}