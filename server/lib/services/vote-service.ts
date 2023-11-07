'use strict';
import Constants from './../constants';
import Vote from './../../../common/model/vote';

import Services from './../services';
import Database from './database';

export default class UserService {
    
    private db: Database;
    private collection: string = 'Vote';

    constructor() {
        // Initialize the database connection using a service
        this.db = Services.get<Database>(Constants.Storage);
    }

    // Insert a single Vote document
    public async insert(data: Vote) {
        this.db.insertOne(data, this.collection);
    }

    // Insert multiple Vote documents
    public async insertMany(data: Vote[]) {
        this.db.insertMany(data, this.collection);
    }

    // Delete a single Vote document
    public async deleteOne(data: Vote) {
        this.db.deleteOne(data, this.collection);
    }

    // Delete a Vote document by its code
    public async deleteOneByCode(code: string) {
        this.db.deleteOne({ "code": code }, this.collection);
    }

    // Delete multiple Vote documents
    public async deleteMany(data: Vote[]) {
        this.db.deleteMany(data, this.collection);
    }

    // Delete multiple Vote documents by a filter
    public async deleteManyByFilter(filter) {
        this.db.deleteMany(filter, this.collection);
    }

    // Delete all Vote documents in the collection
    public async deleteAll() {
        this.db.deleteMany({}, this.collection);
    }

    // Update a single Vote document based on a filter
    public async updateOne(filter, updateDocument) {
        this.db.updateOne(filter, updateDocument, this.collection);
    }

    // Update multiple Vote documents based on a filter
    public async updateMany(filter, updateDocument) {
        this.db.updateMany(filter, updateDocument, this.collection);
    }

    // Read a single Vote document based on a query
    public async readOne(query) {
        return this.db.readOne(query, this.collection);
    }

    // Read all Vote documents in the collection
    public async readAll() {
        return this.db.read({}, this.collection);
    }

    // Read multiple Vote documents based on a query
    public async readMany(query) {
        return this.db.read(query, this.collection);
    }
}
