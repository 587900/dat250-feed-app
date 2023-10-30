'use strict';

import * as http from 'http';
import Logger from './logger';
import Services from './services';
import Constants from './constants';
import Config from './config';

import REST from './rest/rest';

const logger = Logger.getLogger('/lib/entry.ts');

let server = http.createServer();

// TODO: TEMPORARY
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var passport = require('passport');
passport.use(new GoogleStrategy({
    clientID: Config.auth.googleClientID,
    clientSecret: Config.auth.googleClientSecret,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log('STRATEGYCB', accessToken, refreshToken, profile);
    return cb(null, profile);
    /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
});*/
  }
));
passport.serializeUser((user, done) => {/*console.log("SERIALIZE", user);*/done(null, user.id);});
passport.deserializeUser((id, done) => {/*console.log("DESERIALIZE", id);*/done(null, { id });});

logger.info('Starting services...');
Services.add(Constants.RESTMain, new REST());
//Services.add(Constants.Storage, new Database(Config.dbUrl));
logger.info(`Started ${Services.count()} services`);

server.on('request', Services.get<REST>(Constants.RESTMain).listener());

server.listen(Config.port, () => logger.info(`Server started and is listening on port: ${Config.port}`));