'use strict';

import Config from './../config';
import Constants from './../constants';
import Poll, { AllowedVoteType } from './../../../common/model/poll';

import Services from './../services';
import Database from './database';
import VoteService from './vote-service';

import { KeyValuePair } from '../../../common/types';
import User from '../../../common/model/user';
import Vote, { VoteSelection } from '../../../common/model/vote';
import DweetSender from './dweet-sender';

export default class PollService {
    
    private db: Database;

    constructor() {
        this.db = Services.get<Database>(Constants.Storage);
    }

    /** @returns a list of Polls that can be presented to a user. */
    public async collect() : Promise<Poll[]> {
        return await this.db.find({}, Constants.DBPolls) as Poll[];
    }

    public async find(code : string) : Promise<Poll | null> {
        let poll = await this.db.readOne({ code }, Constants.DBPolls) as Poll | null;
        if (poll == null) return null;
        return poll;
    }

    /** @returns true if successful, false is already exists by code */
    public async create(poll : Poll) : Promise<boolean> {
        if (await this.find(poll.code) != null) return false;
        await this.db.insertOne(poll, Constants.DBPolls);
        return true;
    }

    public async close(pollCode : string, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> { return await this.setOpen(pollCode, user, false); }
    public async open(pollCode : string, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> { return await this.setOpen(pollCode, user, true); }
    private async setOpen(pollCode : string, user : User, status : boolean) : Promise<'ok' | 'no-poll' | 'permissions'> {
        let poll = await this.find(pollCode);
        if (poll == null) return 'no-poll';
        if (!this.canUserControl(poll, user)) return 'permissions';
        await this.update(pollCode, { open: status });
        return 'ok';
    }

    public async update(code : string, merge : Partial<Poll>) : Promise<boolean> {
        if (await this.find(code) == null) return false;
        await this.db.updateOne({ code }, { $set: merge }, Constants.DBPolls);
        return true;
    }

    public async delete(code : string, user : User) : Promise<boolean> {
        let poll = await this.find(code);
        if (poll == null) return false;
        if (!this.canUserControl(poll, user)) return false;
        await this.db.deleteOne({ code }, Constants.DBPolls);
        return true;
    }

    /**
     * Consumes data and converts it into a poll. Returns a list of missing fields if data was missing fields. Returns an error if some data was formatted wrongly.
     * @param data The data to parse
     * @param admin If to allow admin-only fields
     */
    public safeParse(data : KeyValuePair<any>, owner : string, creationUnix : number = Date.now()) : { success: true, data: Poll } | { success: false, missing: string[], error?: string } {

        // do fields
        let fields = ['code', 'open', 'title', 'description', 'timed', 'private'];
        if (data.timed == true) fields.push('timeoutUnix');
        if (data.private == true) fields.push('whitelist'); else if (data.private === false) fields.push('allowedVoters');

        // check missing
        let missing = fields.filter(field => data[field] == null);
        if (missing.length > 0) return { success: false, missing };

        // check typings
        if (typeof data.code != 'string') return { success: false, missing, error: 'code must be a string' };
        if (typeof data.open != 'boolean') return { success: false, missing, error: 'open must be a boolean' };
        if (typeof data.title != 'string') return { success: false, missing, error: 'title must be a string' };
        if (typeof data.description != 'string') return { success: false, missing, error: 'description must be a string' };
        if (typeof data.timed != 'boolean') return { success: false, missing, error: 'timed must be a boolean' };
        if (typeof data.private != 'boolean') return { success: false, missing, error: 'private must be a boolean' };

        if (data.timed && typeof data.timeoutUnix != 'number') return { success: false, missing, error: 'timeoutUnix must be a number' };
        if (data.private && !Array.isArray(data.whitelist)) return { success: false, missing, error: 'whitelist must be an array' };
        if (!data.private) {
            if (!Array.isArray(data.allowedVoters)) return { success: false, missing, error: 'allowedVoters must be an array' };
            if (data.allowedVoters.some(type => !['web-user', 'iot-device'].includes(type))) return { success: false, missing, error: 'allowedVoters must be an array of strings' };
        }

        // sanity verify
        //if (data.private && data.whitelist.length > 1024) return { error: 'whitelist must be at most 1024 users' };

        // clean data
        if (data.timed) data.timeoutUnix = Math.floor(data.timeoutUnix);
        if (data.whitelist) data.whitelist = [... new Set(data.whitelist)];
        if (data.allowedVoters) data.allowedVoters = [... new Set(data.allowedVoters)];

        // create poll
        let poll : KeyValuePair<any> = {};
        let allFields = ['code', 'open', 'title', 'description', 'timed', 'private', 'timeoutUnix', 'whitelist', 'allowedVoters'];
        for (let f of allFields) poll[f] = data[f];

        // TODO: whitelist should only contain valid users

        poll.ownerId = owner;
        poll.creationUnix = creationUnix;
        poll.cachedVotes = { red: 0, green: 0 };

        return { success: true, data: poll as Poll };
    }

    /** @returns whether or not a user can see and vote on a poll */
    public canUserSee(poll : Poll, user : User) : boolean {
        if (user.claims.includes('admin')) return true;

        if (poll.private) return poll.whitelist.includes(user.id);

        for (let claim of user.claims) {
            if (poll.allowedVoters.includes(<AllowedVoteType>claim)) return true;
        }
        return false;
    }

    /** @returns whether or not a user can change the details of a poll (title, description, open, etc...) */
    public canUserControl(poll : Poll, user : User) : boolean {
        if (user.claims.includes('admin')) return true;
        return user.id == poll.ownerId;
    }

    public async vote(pollCode : string, user : User, selection : VoteSelection) : Promise<{ success: true, vote: Vote } | { success: false, reason: 'no-poll' | 'permissions' | 'invalid-selection' }> {
        if (!['green', 'red'].includes(selection)) return { success: false, reason: 'invalid-selection' };

        let poll = await this.find(pollCode);
        if (poll == null) return { success: false, reason: 'no-poll' };

        if (!this.canUserSee(poll, user)) return { success: false, reason: 'permissions' };

        let votes = Services.get<VoteService>(Constants.VoteService);
        let vote = await votes.find({ pollCode: poll.code, userId: user.id });

        let promises : Promise<any>[] = [];

        if (vote == null) {
            vote = { pollCode: poll.code, userId: user.id, selection, creationUnix: Date.now() };
            promises.push(votes.create(vote));
            promises.push(this.db.updateOne({ code: poll.code }, { $inc: { [`cachedVotes.${selection}`]: 1 } }, Constants.DBPolls));
        } else {
            if (vote.selection == selection) return { success: true, vote }; // no change
            let creationUnix = Date.now();
            promises.push(votes.updateOne({ pollCode: poll.code, userId: user.id }, { selection, creationUnix }));
            promises.push(this.db.updateOne({ code: poll.code }, { $inc: { [`cachedVotes.${selection}`]: 1, [`cachedVotes.${vote.selection}`]: -1 } }, Constants.DBPolls));
            vote.creationUnix = creationUnix;
            vote.selection = selection;
        }

        await Promise.all(promises);

        return { success: true, vote };
    }

    public async dweet(pollCode : string, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> {
        let poll = await this.find(pollCode);
        if (poll == null) return 'no-poll';
        if (!this.canUserControl(poll, user)) return 'permissions';

        let dweeter = Services.get<DweetSender>(Constants.DweetSender);
        await dweeter.send({ title: poll.title, description: poll.description, code: poll.code, votes: poll.cachedVotes }, Config.dweetPrefix + poll.code);

        return 'ok';
    }

}