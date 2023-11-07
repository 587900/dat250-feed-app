'use strict';
import Constants from './../constants';
import User from './../../../common/model/user';

import Services from './../services';
import Database from './database';

export default class UserService {
    
    private db: Database;
    private collection: string = 'User';

    constructor() {
        // Initialize the database connection using a service
        this.db = Services.get<Database>(Constants.Storage);
    }

    // Insert a single User document
    public async insert(data: User) {
        // Generate a unique ID for the User document
        data.id = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
        this.db.insertOne(data, this.collection);
    }

    // Insert multiple User documents
    public async insertMany(data: User[]) {
        this.db.insertMany(data, this.collection);
    }

    // Delete a single User document
    public async deleteOne(data: User) {
        this.db.deleteOne(data, this.collection);
    }

    // Delete a User document by its code
    public async deleteOneByCode(code: string) {
        this.db.deleteOne({ "code": code }, this.collection);
    }

    // Delete multiple User documents
    public async deleteMany(data: User[]) {
        this.db.deleteMany(data, this.collection);
    }

    // Delete multiple User documents by a filter
    public async deleteManyByFilter(filter) {
        this.db.deleteMany(filter, this.collection);
    }

    // Delete all User documents in the collection
    public async deleteAll() {
        this.db.deleteMany({}, this.collection);
    }

    // Update a single User document based on a filter
    public async updateOne(filter, updateDocument) {
        this.db.updateOne(filter, updateDocument, this.collection);
    }

    // Update multiple User documents based on a filter
    public async updateMany(filter, updateDocument) {
        this.db.updateMany(filter, updateDocument, this.collection);
    }

    // Read a single User document based on a query
    public async readOne(query) {
        return this.db.readOne(query, this.collection);
    }

    // Read all User documents in the collection
    public async readAll() {
        return this.db.read({}, this.collection);
    }

    // Read multiple User documents based on a query
    public async readMany(query) {
        return this.db.read(query, this.collection);
    }
}
