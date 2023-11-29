'use strict';

import crypto from 'crypto';

import User, { Claim, LastLoggedInWith as LoginMethod } from './../../../common/model/user';

import Logger from './../logger';
import Database from './database';
import Services from './../services';
import Constants from './../constants';

export default class AuthService {

    private static LOCAL_ALGORITHM = 'sha512';
    private static LOCAL_ITERATIONS = 210000;
    private static LOCAL_KEYLEN = 64;
    private static LOCAL_SALTLEN = 64;

    private logger: Logger;

    constructor() { this.logger = Logger.getLogger('/lib/services/auth-service.ts'); }

    // Note: This is called by passport-setup, not in this class
    public async notifyLogin(id : string, method : LoginMethod, unix : number = Date.now()) : Promise<void> {
        this.logger.info(`User with id '${id}' logged in with '${method}' at time '${unix}'`);
        await Services.get<Database>(Constants.Storage).updateOne({ id }, { $set: { lastLoggedInWith: method, lastLoggedInUnix: unix } }, Constants.DBUsers);
    }

    // TODO: This should be moved to the 'user service'
    public async create(firstName : string, lastName : string, claims : Claim[], username : string, guest : boolean) : Promise<User | null> {
        if (await this.getUserByUsername(username) != null) return null;
        let user : User = { id: this.generateId(), creationUnix: Date.now(), lastLoggedInUnix: Date.now(), lastLoggedInWith: 'none', firstName, lastName, claims, username, guest };
        await Services.get<Database>(Constants.Storage).insertOne(user, Constants.DBUsers);
        return user;
    }

    public async delete(id : string) : Promise<boolean> {
        if (await this.getUserById(id) == null) return false;
        await Services.get<Database>(Constants.Storage).deleteOne({ id }, Constants.DBUsers);
        return true;
    }

    private async fetchLocalUserMetadata(id : string) : Promise<{ salt : string, passwordHash : String } | null> {
        let authlink = await this.getAuthLink('local-auth', id);
        if (authlink == null) return null;

        if (typeof authlink.metadata !== 'object' || authlink.metadata == null) {
            this.logger.error(`User with local-auth link id '${id}' had no metadata`);
            return null;
        }

        let { salt, passwordHash } = authlink.metadata;

        if (typeof salt !== 'string' || salt == null) {
            this.logger.error(`User with local-auth link id '${id}' had no salt`);
            return null;
        }

        if (typeof passwordHash !== 'string' || passwordHash == null) {
            this.logger.error(`User with local-auth link id '${id}' had no passwordHash`);
            return null;
        }

        return { salt, passwordHash };
    }

    public async verifyLocalUserPassword(id : string, password : string) : Promise<boolean> {
        return new Promise<boolean>(async (resolve, _) => {
            let metadata = await this.fetchLocalUserMetadata(id);
            if (metadata == null) return resolve(false);

            let phash = metadata.passwordHash;
            crypto.pbkdf2(password, metadata.salt, AuthService.LOCAL_ITERATIONS, AuthService.LOCAL_KEYLEN, AuthService.LOCAL_ALGORITHM, (err, derivedKey) => {
                if (err) { this.logger.warn(`User with id '${id}' failed to verify password with error: ${err}`); return resolve(false); }
                if (!crypto.timingSafeEqual(Buffer.from(phash, 'hex'), derivedKey)) return resolve(false);
                return resolve(true);
            });
        });
    }

    private async createLocalUserMetadata(password : string) : Promise<{ salt : string, passwordHash : string } | null> {
        return new Promise<{ salt : string, passwordHash : string } | null>((resolve, _) => {
            crypto.randomBytes(AuthService.LOCAL_SALTLEN, (err, salt) => {
                if (err) { this.logger.warn(`Failed to create local user metadata with error: ${err}`); return resolve(null); }

                crypto.pbkdf2(password, salt.toString('hex'), AuthService.LOCAL_ITERATIONS, AuthService.LOCAL_KEYLEN, AuthService.LOCAL_ALGORITHM, (err, derivedKey) => {
                    if (err) { this.logger.warn(`Failed to create local user metadata with error: ${err}`); return resolve(null); }

                    return resolve({ salt: salt.toString('hex'), passwordHash: derivedKey.toString('hex') });
                });
            });
        });
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

    public async getUserByLocalGuestId(localGuestId : string) : Promise<User | null> {
        let userId = (await this.getAuthLink('local-guest-auth', localGuestId))?.userId;
        if (userId == null) return null;
        return await this.getUserById(userId);
    }

    public async getUserByLocalId(localId : string) : Promise<User | null> {
        let userId = (await this.getAuthLink('local-auth', localId))?.userId;
        if (userId == null) return null;
        return await this.getUserById(userId);
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

    public async linkLocalGuestAccount(userId : string, localGuestId : string) : Promise<boolean> {
        if (await this.getAuthLink('local-guest-auth', localGuestId) != null) return false;
        await this.createAuthLink(userId, 'local-guest-auth', localGuestId);
        return true;
    }

    public async linkLocalAccount(userId : string, localId : string, password : string) : Promise<boolean> {
        if (await this.getAuthLink('local-auth', localId) != null) return false;
        let metadata = await this.createLocalUserMetadata(password);
        if (metadata == null) return false;
        await this.createAuthLink(userId, 'local-auth', localId, metadata);
        return true;
    }

    public async linkGoogleAccount(userId : string, googleId : string) : Promise<boolean> {
        if (await this.getAuthLink('google-auth', googleId) != null) return false;
        await this.createAuthLink(userId, 'google-auth', googleId);
        return true;
    }

    private async createAuthLink(userId : string, type : string, id : string, metadata? : any) : Promise<void> {
        let db = Services.get<Database>(Constants.Storage);
        let link : AuthLink = { userId, type, id, creationUnix: Date.now(), lastFetchedUnix: Date.now() };
        if (metadata != null) link.metadata = metadata;
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

export type AuthLink = { userId : string, type : string, id : string, creationUnix : number, lastFetchedUnix : number, metadata? : any }