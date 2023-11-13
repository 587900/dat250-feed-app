'use strict';

import { Db, MongoClient, ServerApiVersion } from 'mongodb';
import { KeyValuePair } from '../../../common/types';

export default class Database {

    private db : Db;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    constructor(uri) {
        let client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        this.db = client.db();
    }

    public async find(query : KeyValuePair<any>, collection : string) : Promise<any[] | null> {
        return await this.db.collection(collection).find(query).toArray();
    }

    public async ping() : Promise<void> {
        await this.db.command({ ping: 1 });
    }

    // Update the first document that matches the filter with the new data in updateDocument
    public async updateOne(match : KeyValuePair<any>, statement : KeyValuePair<any>, collection : string) : Promise<void> {
        await this.db.collection(collection).updateOne(match, statement);
    }

    // Update all documents that match the filter with the new data in updateDocument
    async updateMany(filter, updateDocument, collection: string) {
        const myColl = this.db.collection(collection);
        return await myColl.updateMany(filter, updateDocument);
    }

    // Insert a single document into a collection in MongoDB
    async insertOne(document, collection: string) {
        const myColl = this.db.collection(collection);

        const result = await myColl.insertOne(document);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }

    // Insert multiple documents into a collection in MongoDB
    async insertMany(documents, collection: string) {
        const myColl = this.db.collection(collection);

        try {
            const insertManyResult = await myColl.insertMany(documents);
            let ids = insertManyResult.insertedIds;
            console.log(`${insertManyResult.insertedCount} documents were inserted.`);
            for (let id of Object.values(ids)) {
                console.log(`Inserted a document with id ${id}`);
            }
        } catch (e) {
            console.log(`A MongoBulkWriteException occurred. Number of documents inserted: ${e.result.result.nInserted}`);
        }
    }

    // Delete the first document in the database that matches the given filter
    async deleteOne(document, collection: string) {
        const myColl = this.db.collection(collection);

        const deleteResult = await myColl.deleteOne(document);
        console.log(`Number of documents deleted: ${deleteResult.deletedCount}`);
    }

    // Delete all documents in the database that match the given filter
    async deleteMany(documents, collection: string) {
        const myColl = this.db.collection(collection);

        const deleteManyResult = await myColl.deleteMany(documents);
        console.log(`Number of documents deleted: ${deleteManyResult.deletedCount}`);
    }

    // Retrieve all documents that match the given query
    async read(query, collection: string) {
        const myColl = this.db.collection(collection);
        return await myColl.find(query);
    }

    // Retrieve the first document that matches the given query
    async readOne(query, collection: string) {
        const myColl = this.db.collection(collection);
        return await myColl.findOne(query);
    }
}
