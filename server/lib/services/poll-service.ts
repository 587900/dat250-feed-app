'use strict';
import Constants from './../constants';
import Poll from './../../../common/model/poll';

import Services from './../services';
import Database from './database';

export default class PollService {
    
    private db: Database;
    private collection: string = 'Poll';

    constructor() {
        // Initialize the database connection using a service
        this.db = Services.get<Database>(Constants.Storage);
    }

    // Insert a single Poll document
    public async insert(data: Poll) {
        // Generate a unique code for the Poll document
        data.code = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
        this.db.insertOne(data, this.collection);
    }

    // Insert multiple Poll documents
    public async insertMany(data: Poll[]) {
        this.db.insertMany(data, this.collection);
    }

    // Delete a single Poll document
    public async deleteOne(data: Poll) {
        this.db.deleteOne(data, this.collection);
    }

    // Delete a Poll document by its code
    public async deleteOneByCode(code: string) {
        this.db.deleteOne({ "code": code }, this.collection);
    }

    // Delete multiple Poll documents
    public async deleteMany(data: Poll[]) {
        this.db.deleteMany(data, this.collection);
    }

    // Delete multiple Poll documents by a filter
    public async deleteManyByFilter(filter) {
        this.db.deleteMany(filter, this.collection);
    }

    // Delete all Poll documents in the collection
    public async deleteAll() {
        this.db.deleteMany({}, this.collection);
    }

    // Update a single Poll document based on a filter
    public async updateOne(filter, updateDocument) {
        this.db.updateOne(filter, updateDocument, this.collection);
    }

    // Update multiple Poll documents based on a filter
    public async updateMany(filter, updateDocument) {
        this.db.updateMany(filter, updateDocument, this.collection);
    }

    // Read a single Poll document based on a query
    public async readOne(query) {
        return this.db.readOne(query, this.collection);
    }

    // Read all Poll documents in the collection
    public async readAll() {
        return this.db.read({}, this.collection);
    }

    // Read multiple Poll documents based on a query
    public async readMany(query) {
        return this.db.read(query, this.collection);
    }
}
