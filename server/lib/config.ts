'use strict';

/** Defines configuration based on environment variables (process.env) */

let isProduction = (process.env.NODE_ENV !== 'dev' && process.env.NODE_ENV !== 'development');

if (process.env.db_url == null) throw new Error(`IllegalArgumentException environment variable 'db_url' must be set (was not set)`);
let dbUrl = <string>process.env.db_url;

let port = Number(process.env.port);
if (isNaN(port)) throw new Error(`IllegalArgumentException environment variable 'port' must be a number. Got ${process.env.port}`);

if (process.env.session_secret == null) throw new Error(`IllegalArgumentException environment variable 'session_secret' must be set (was not set)`);
let sessionSecret = <string>process.env.session_secret;

if (process.env.google_client_id == null) throw new Error(`IllegalArgumentException environment variable 'google_client_id' must be set (was not set)`);
let googleClientID = <string>process.env.google_client_id;

if (process.env.google_client_secret == null) throw new Error(`IllegalArgumentException environment variable 'google_client_secret' must be set (was not set)`);
let googleClientSecret = <string>process.env.google_client_secret;

if (process.env.dweet_prefix == null) throw new Error(`IllegalArgumentException environment variable 'dweet_prefix' must be set (was not set)`);
let dweetPrefix = <string>process.env.dweet_prefix;

if (process.env.passport_url == null) throw new Error(`IllegalArgumentException environment variable 'passport_url' must be set (was not set)`);
let passportUrl = <string>process.env.passport_url;

let mqttUrl = process.env.mqtt_url || null;

export default {
    // mandatory
    isProduction, dbUrl, port, sessionSecret, auth: { googleClientID, googleClientSecret }, dweetPrefix, passportUrl,
    // optional
    mqttUrl
}