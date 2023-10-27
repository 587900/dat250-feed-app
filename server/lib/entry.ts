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

//server.listen(Config.port, () => logger.info(`Server started and is listening on port: ${Config.port}`));

import mongoose from 'mongoose';

mongoose.connect(Config.dbUrl).then(() => console.log('Connected!')).catch(e => console.error(e));

const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(Config.dbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);