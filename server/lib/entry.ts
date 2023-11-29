'use strict';

import * as http from 'http';
import Logger from './logger';
import Services from './services';
import Constants from './constants';
import Config from './config';

import REST from './rest/rest';
import Database from './services/database';
import PollService from './services/poll-service';
import UserService from './services/user-service';
import VoteService from './services/vote-service';
import AuthService from './services/auth-service';
import DweetSender from './services/dweet-sender';
import MQTTSender from './services/mqtt-sender';
import EventMaster from './services/event-master';
import PassportSetup from './services/passport-setup';

const logger = Logger.getLogger('/lib/entry.ts');

let server = http.createServer();

logger.info('Starting services...');
Services.add(Constants.Storage, new Database(Config.dbUrl));
Services.add(Constants.MQTTSender, new MQTTSender(Config.mqttUrl));
Services.add(Constants.PollService, new PollService());
Services.add(Constants.UserService, new UserService());
Services.add(Constants.VoteService, new VoteService());
Services.add(Constants.AuthService, new AuthService());
Services.add(Constants.PassportSetup, new PassportSetup());
Services.add(Constants.DweetSender, new DweetSender());
Services.add(Constants.EventMaster, new EventMaster());
Services.add(Constants.RESTMain, new REST());
logger.info(`Started ${Services.count()} services`);

logger.debug('Setting up passport...');
Services.get<PassportSetup>(Constants.PassportSetup).setup(Config.passportUrl);
logger.debug('Passport setup complete');

server.on('request', Services.get<REST>(Constants.RESTMain).listener());

server.listen(Config.port, () => logger.info(`Server started and is listening on port: ${Config.port}`));