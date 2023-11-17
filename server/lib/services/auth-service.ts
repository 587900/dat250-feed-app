'use strict';

import User, { Claim, LastLoggedInWith as LoginMethod } from './../../../common/model/user';

import Logger from './../logger';
import Database from './database';
import Services from './../services';
import Constants from './../constants';

export default class AuthService {

    private logger: Logger;

    constructor() { this.logger = Logger.getLogger('/lib/services/auth-service.ts'); }

    // Note: This is called by passport-setup, not in this class
    public async notifyLogin(id : string, method : LoginMethod, unix : number = Date.now()) : Promise<void> {
        this.logger.info(`User with id '${id}' logged in with '${method}' at time '${unix}'`);
        await Services.get<Database>(Constants.Storage).updateOne({ id }, { $set: { lastLoggedInWith: method, lastLoggedInUnix: unix } }, Constants.DBUsers);
    }

    // TODO: This should be moved to the 'user service'
    public async create(firstName : string, lastName : string, claims : Claim[], username : string) : Promise<User | null> {
        if (await this.getUserByUsername(username) != null) return null;
        let user : User = { id: this.generateId(), creationUnix: Date.now(), lastLoggedInUnix: Date.now(), lastLoggedInWith: 'none', firstName, lastName, claims, username };
        await Services.get<Database>(Constants.Storage).insertOne(user, Constants.DBUsers);
        return user;
    }

    public async delete(id : string) : Promise<boolean> {
        if (await this.getUserById(id) == null) return false;
        await Services.get<Database>(Constants.Storage).deleteOne({ id }, Constants.DBUsers);
        return true;
    }

    private generateId() : string {
        let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 16; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
        return id;
    }

    public async getUserByUsername(username : string) : Promise<User | null> {
        let db = Services.get<Database>(Constants.Storage);
        let results = await db.find({ username }, Constants.DBUsers) as User[];
        if (results == null) return null;
        if (results.length == 0) return null;

        let user = results[0];
        if (user == null) return null;

        return user;
    }

    public async getUserById(id : string) : Promise<User | null> {
        let db = Services.get<Database>(Constants.Storage);
        let results = await db.find({ id }, Constants.DBUsers) as User[];
        if (results == null) return null;
        if (results.length == 0) return null;

        let user = results[0];
        if (user == null) return null;

        return user;
    }

    public async getUserByGoogleId(googleId : string) : Promise<User | null> {
        let userId = (await this.getAuthLink('google-auth', googleId))?.userId;
        if (userId == null) return null;
        return await this.getUserById(userId);
    }

    public async getUserByIOTToken(iotToken : string) : Promise<User | null> {
        let userId = (await this.getAuthLink('iot-auth', iotToken))?.userId;
        if (userId == null) return null;
        return await this.getUserById(userId);
    }

    public async linkGoogleAccount(userId : string, googleId : string) : Promise<boolean> {
        if (await this.getAuthLink('google-auth', googleId) != null) return false;
        await this.createAuthLink(userId, 'google-auth', googleId);
        return true;
    }

    private async createAuthLink(userId : string, type : string, id : string) : Promise<void> {
        let db = Services.get<Database>(Constants.Storage);
        let link : AuthLink = { userId, type, id, creationUnix: Date.now(), lastFetchedUnix: Date.now() };
        await db.insertOne(link, Constants.DBAUthLinks);
    }

    private async getAuthLink(type : string, id : string) : Promise<AuthLink | null> {
        let db = Services.get<Database>(Constants.Storage);
        let results = await db.find({ type, id }, Constants.DBAUthLinks) as AuthLink[];
        if (results == null) return null;
        if (results.length == 0) return null;

        let link = results[0];
        if (link == null) return null;

        db.updateOne(link, { $set: { lastFetchedUnix: Date.now() } }, Constants.DBAUthLinks);
        return link;
    }

}

export type AuthLink = { userId : string, type : string, id : string, creationUnix : number, lastFetchedUnix : number }