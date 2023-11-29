'use strict';

import Config from './../config';
import Constants from './../constants';
import Poll, { AllowedVoteType } from './../../../common/model/poll';
import APIPoll from './../../../common/model/api-poll';

import Services from './../services';
import Database from './database';
import VoteService from './vote-service';
import UserService from './user-service';
import EventMaster from './event-master';

import { KeyValuePair } from '../../../common/types';
import User from '../../../common/model/user';
import Vote, { VoteSelection } from '../../../common/model/vote';
import DweetSender from './dweet-sender';

export default class PollService {
    
    private static addOwnerUsername = [
        { $lookup: { from: 'users', localField: 'ownerId', foreignField: 'id', as: 'owner' } },
        { $unwind: '$owner' },
        { $addFields: { username: '$owner.username' } }
    ];

    private db: Database;

    constructor() {
        this.db = Services.get<Database>(Constants.Storage);
    }

    /** @returns a list of Polls that can be presented to a user. */
    public async collect(match : KeyValuePair<any>) : Promise<APIPoll[]> {
        let options = [{ $match: match }, ...PollService.addOwnerUsername];
        return await this.db.aggregate(options, Constants.DBPolls) as APIPoll[];
    }

    /** @returns a list of all Polls for use internally */
    public async all() : Promise<Poll[]> {
        return await this.db.find({}, Constants.DBPolls) as Poll[];
    }

    public async find(code : string) : Promise<Poll | null> {
        let options = [{ $match: { code } }, ...PollService.addOwnerUsername];
        let polls = await this.db.aggregate(options, Constants.DBPolls) as Poll[] | null;
        if (polls == null || polls.length == 0 || polls[0] == null) return null;
        return polls[0];
    }

    /** @returns true if successful, false is already exists by code */
    public async create(poll : Poll) : Promise<boolean> {
        if (await this.find(poll.code) != null) return false;
        let p1 = this.db.insertOne(poll, Constants.DBPolls);
        let p2 = Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'create', code: poll.code, totalVotes: poll.cachedVotes });
        await Promise.all([p1, p2]);
        if (poll.open) await Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'open', code: poll.code, totalVotes: poll.cachedVotes })
        return true;
    }

    public async close(code : string, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> { return await this.setOpen(code, user, false); }
    public async open(code : string, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> { return await this.setOpen(code, user, true); }
    private async setOpen(code : string, user : User, status : boolean) : Promise<'ok' | 'no-poll' | 'permissions'> {
        let poll = await this.find(code);
        if (poll == null) return 'no-poll';
        if (!this.canUserControl(poll, user)) return 'permissions';
        let p1 = this.update(code, { open: status });
        let p2 = Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: (status ? 'open' : 'close'), code, totalVotes: poll.cachedVotes });
        await Promise.all([p1, p2]);
        return 'ok';
    }

    public async closeTimeout(code : string) : Promise<'ok' | 'no-poll' | 'not-timed' | 'not-timed-out' | 'already-closed'> {
        let poll = await this.find(code);
        if (poll == null) return 'no-poll';
        if (!poll.timed) return 'not-timed';
        if (!poll.open) return 'already-closed';
        if (poll.timeoutUnix > Date.now()) return 'not-timed-out';
        let p1 = this.update(code, { open: false });
        let p2 = Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'close', code, totalVotes: poll.cachedVotes });
        await Promise.all([p1, p2]);
        return 'ok';
    }

    public async updateAs(code : string, merge : Partial<Poll>, user : User) : Promise<'ok' | 'no-poll' | 'permissions'> {
        let poll = await this.find(code);
        if (poll == null) return 'no-poll';
        if (!this.canUserControl(poll, user)) return 'permissions';
        await this.update(code, merge);
        return 'ok';
    }

    public async update(code : string, merge : Partial<Poll>) : Promise<boolean> {
        let existing = await this.find(code);
        if (existing == null) return false;
        let p1 = this.db.updateOne({ code }, { $set: merge }, Constants.DBPolls);
        let p2 = Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'update', code: merge.code || code, totalVotes: merge.cachedVotes || existing.cachedVotes, oldCode: code, changed: Object.keys(merge) });
        await Promise.all([p1, p2]);
        return true;
    }

    public async delete(code : string, user : User) : Promise<boolean> {
        let poll = await this.find(code);
        if (poll == null) return false;
        if (!this.canUserControl(poll, user)) return false;
        let p1 = this.db.deleteOne({ code }, Constants.DBPolls);
        let p2 = Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'delete', code, totalVotes: poll.cachedVotes });
        await Promise.all([p1, p2]);
        return true;
    }

    /** Consumes data and converts it into a poll. Returns a list of missing fields if data was missing fields. Returns an error if some data was formatted wrongly. */
    public async safeParse(data : KeyValuePair<any>, owner : string, creationUnix : number = Date.now()) : Promise<{ success: true, data: Poll } | { success: false, missing: string[], error?: string }> {

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
        let allFields = ['code', 'open', 'title', 'description', 'timed', 'private', 'timeoutUnix', 'allowedVoters'];
        for (let f of allFields) poll[f] = data[f];

        // whitelist is an array of usernames, should be saved as ids
        if (data.private) poll.whitelist = await Services.get<UserService>(Constants.UserService).usernamesToIds(data.whitelist);

        poll.ownerId = owner;
        poll.creationUnix = creationUnix;
        poll.cachedVotes = { red: 0, green: 0 };

        return { success: true, data: poll as Poll };
    }

    /** Consumes data and converts it into a partial poll. Returns an error if some data was formatted wrongly. Will apply some fields only if admin is true */
    public async safeParsePartial(data : KeyValuePair<any>, admin : boolean) : Promise<{ success: true, data: Partial<Poll> } | { success: false, error: string }> {

        // check typings
        if (data.open != null && typeof data.open != 'boolean') return { success: false, error: 'open must be a boolean' };
        if (data.title != null && typeof data.title != 'string') return { success: false, error: 'title must be a string' };
        if (data.description != null && typeof data.description != 'string') return { success: false, error: 'description must be a string' };
        if (data.timed != null && typeof data.timed != 'boolean') return { success: false, error: 'timed must be a boolean' };
        if (data.private != null && typeof data.private != 'boolean') return { success: false, error: 'private must be a boolean' };

        // if certain fields are provided, others MUST be present
        if (data.timed && typeof data.timeoutUnix != 'number') return { success: false, error: 'timeoutUnix must be a number' };
        if (data.private && !Array.isArray(data.whitelist)) return { success: false, error: 'whitelist must be an array' };
        if (!data.private) {
            if (!Array.isArray(data.allowedVoters)) return { success: false, error: 'allowedVoters must be an array' };
            if (data.allowedVoters.some(type => !['web-user', 'iot-device'].includes(type))) return { success: false, error: 'allowedVoters must be an array of strings' };
        }

        // admin-only fields
        if (data.code != null && typeof data.code != 'string') return { success: false, error: 'code must be a string' };
        if (data.creationUnix != null && typeof data.creationUnix != 'number') return { success: false, error: 'creationUnix must be a number' };
        if (data.cachedVotes != null && typeof data.cachedVotes != 'object') return { success: false, error: 'cachedVotes must be an object' };
        if (data.ownerId != null && typeof data.ownerId != 'string') return { success: false, error: 'ownerId must be a string' };

        // sanity verify
        //if (data.private && data.whitelist.length > 1024) return { error: 'whitelist must be at most 1024 users' };

        // clean data
        if (data.timed) data.timeoutUnix = Math.floor(data.timeoutUnix);
        if (data.whitelist) data.whitelist = [... new Set(data.whitelist)];
        if (data.allowedVoters) data.allowedVoters = [... new Set(data.allowedVoters)];

        // create poll
        let poll : KeyValuePair<any> = {};
        let allFields = ['open', 'title', 'description', 'timed', 'private', 'timeoutUnix', 'allowedVoters'];
        for (let f of allFields) poll[f] = data[f];

        // whitelist is an array of usernames, should be saved as ids
        if (data.private) poll.whitelist = await Services.get<UserService>(Constants.UserService).usernamesToIds(data.whitelist);

        if (admin) {
            let adminFields = ['code', 'creationUnix', 'cachedVotes', 'ownerId'];
            for (let f of adminFields) poll[f] = data[f];
        }

        return { success: true, data: poll as Partial<Poll> };
    }

    /** @returns whether or not a user can view a poll */
    public canUserSee(poll : Poll, user : User) : boolean {
        if (user.claims.includes('admin')) return true;
        if (poll.ownerId == user.id) return true;

        if (poll.private) return poll.whitelist.includes(user.id);

        return true; // poll is public
    }

    /** @returns whether or not a user can vote on a poll */
    public canUserVote(poll : Poll, user : User) : boolean {
        if (user.claims.includes('admin')) return true;
        if (poll.ownerId == user.id) return true;

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

    public async vote(pollCode : string, user : User, selection : VoteSelection) : Promise<{ success: true, vote: Vote, changed: boolean } | { success: false, reason: 'no-poll' | 'permissions' | 'invalid-selection' }> {
        if (!['green', 'red'].includes(selection)) return { success: false, reason: 'invalid-selection' };

        let poll = await this.find(pollCode);
        if (poll == null) return { success: false, reason: 'no-poll' };

        if (!this.canUserVote(poll, user)) return { success: false, reason: 'permissions' };

        let votes = Services.get<VoteService>(Constants.VoteService);
        let vote = await votes.find({ pollCode: poll.code, userId: user.id });

        let promises : Promise<any>[] = [];
        let totalVotes = {...poll.cachedVotes};

        if (vote == null) {
            vote = { pollCode: poll.code, userId: user.id, selection, creationUnix: Date.now() };
            promises.push(votes.create(vote));
            promises.push(this.db.updateOne({ code: poll.code }, { $inc: { [`cachedVotes.${selection}`]: 1 } }, Constants.DBPolls));
            totalVotes[selection]++;
        } else {
            if (vote.selection == selection) return { success: true, vote, changed: false }; // no change
            let creationUnix = Date.now();
            promises.push(votes.updateOne({ pollCode: poll.code, userId: user.id }, { selection, creationUnix }));
            promises.push(this.db.updateOne({ code: poll.code }, { $inc: { [`cachedVotes.${selection}`]: 1, [`cachedVotes.${vote.selection}`]: -1 } }, Constants.DBPolls));
            totalVotes[vote.selection]--;
            totalVotes[selection]++;
            vote.creationUnix = creationUnix;
            vote.selection = selection;
        }

        promises.push(Services.get<EventMaster>(Constants.EventMaster).submit({ type: 'poll', detail: 'vote', code: poll.code, selection, totalVotes }));

        await Promise.all(promises);

        return { success: true, vote, changed: true };
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