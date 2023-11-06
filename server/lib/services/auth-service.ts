'use strict';

import User, { LastLoggedInWith as LoginMethod } from './../../../common/model/user';

import Logger from './../logger';

export default class AuthService {

    private logger: Logger;

    constructor() { this.logger = Logger.getLogger('/lib/services/auth-service.ts'); }

    public notifyLogin(id : string, method : LoginMethod, unix : number = Date.now()) {
        this.logger.info(`User with id '${id}' logged in with '${method}' at time '${unix}'`);
        // TODO: Services.get(database).update('users', id == id, { lastLoggedInWith: method, lastLoggedInUnix: unix })
    }

    public getUserById(id : string) : User {
        // TODO: Services.get(database).find('users', id == id);
        return { id, creationUnix: 0, lastLoggedInWith: 'google', lastLoggedInUnix: Date.now(),
        claims: [ 'web-user' ], firstName: 'User', lastName: 'Account' };
    }

    public getUserByGoogleId(googleId : string) : User {
        // TODO: Check: Can chain for optimized database query?
        return this.getUserById(this.getIdByGoogleId(googleId));
    }

    public getIdByGoogleId(googleId : string) : string {
        // TODO: Services.get(database).find('google-auth', googleId == googleId).id;
        return 'not-implemented';
    }

}