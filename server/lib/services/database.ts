import { MongoClient, ServerApiVersion } from 'mongodb';

export default class Database {

    private client;
    private myDb;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    constructor(uri, databaseName: String) {
        this.client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });

        this.myDb = this.client.db(databaseName);
    }

    // Check if the connection to MongoDB is working
    async checkIfConnectionWork() {
        try {
            // Connect the client to the server (optional starting in v4.7)
            await this.client.connect();
            // Send a ping to confirm a successful connection
            await this.client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
            // Ensure that the client will close when you finish/error
            await this.client.close();
        }
    }

    // Insert a single document into a collection in MongoDB
    async insertOne(document, collection: string) {
        const myColl = this.myDb.collection(collection);

        const result = await myColl.insertOne(document);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }

    // Insert multiple documents into a collection in MongoDB
    async insertMany(documents, collection: string) {
        const myColl = this.myDb.collection(collection);

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
        const myColl = this.myDb.collection(collection);

        const deleteResult = await myColl.deleteOne(document);
        console.log(`Number of documents deleted: ${deleteResult.deletedCount}`);
    }

    // Delete all documents in the database that match the given filter
    async deleteMany(documents, collection: string) {
        const myColl = this.myDb.collection(collection);

        const deleteManyResult = await myColl.deleteMany(documents);
        console.log(`Number of documents deleted: ${deleteManyResult.deletedCount}`);
    }

    // Update the first document that matches the filter with the new data in updateDocument
    async updateOne(filter, updateDocument, collection: string) {
        const myColl = this.myDb.collection(collection);
        return await myColl.updateOne(filter, updateDocument);
    }

    // Update all documents that match the filter with the new data in updateDocument
    async updateMany(filter, updateDocument, collection: string) {
        const myColl = this.myDb.collection(collection);
        return await myColl.updateMany(filter, updateDocument);
    }

    // Retrieve all documents that match the given query
    async read(query, collection: string) {
        const myColl = this.myDb.collection(collection);
        return await myColl.find(query);
    }

    // Retrieve the first document that matches the given query
    async readOne(query, collection: string) {
        const myColl = this.myDb.collection(collection);
        return await myColl.findOne(query);
    }
}
