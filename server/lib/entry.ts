'use strict';

import * as http from 'http';
import Logger from './logger';
import Services from './services';
import Constants from './constants';
import Config from './config';

import REST from './rest/rest';

const logger = Logger.getLogger('/lib/entry.ts');

let server = http.createServer();

logger.info('Starting services...');
Services.add(Constants.RESTMain, new REST());
//Services.add(Constants.Storage, new Database(Config.dbUrl));
logger.info(`Started ${Services.count()} services`);

server.on('request', Services.get<REST>(Constants.RESTMain).listener());

server.listen(Config.port, () => logger.info(`Server started and is listening on port: ${Config.port}`));