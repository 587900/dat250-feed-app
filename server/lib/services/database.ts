import { MongoClient, ServerApiVersion } from 'mongodb';

export default class Database {

    private client;

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    constructor(uri) {
        this.client = new MongoClient(uri, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
          });
    }

/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

async insertOne(documents, collection : string) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    const result = await myColl.insertOne(documents);
    console.log(
       `A document was inserted with the _id: ${result.insertedId}`,
    );
}

async insertMany(documents, collection : string) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    try{
        const insertManyresult = await myColl.insertMany(documents);
        let ids = insertManyresult.insertedIds;
        console.log(`${insertManyresult.insertedCount} documents were inserted.`);
        for (let id of Object.values(ids)) {
            console.log(`Inserted a document with id ${id}`);
    }
    } catch(e) {
        console.log(`A MongoBulkWriteException occurred. Number of documents inserted: ${e.result.result.nInserted}`);
 }
}

//Deletes the first document in database that have literals equal to document
async deleteOneByObject(document, collection) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    const deleteResult = await myColl.deleteOne(document);
    console.dir(`Number of documents deleted: ${deleteResult.deletedCount}`);
}

//Deletes all document in the database that have literals equal to document
async deleteManyByObject(document, collection) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    const deleteManyResult  = await myColl.deleteMany(document);
    console.dir(`Number of documents deleted: ${deleteManyResult .deletedCount}`);
}

async update(){

}

async readAll(collection) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    const findResult = await myColl.find()
    return findResult
}

async readOne(collection, options) {
    const myDb = this.client.db("Feed-app");
    const myColl =  myDb.collection(collection);

    const findResult = await myColl.findOne({}, options)
    return findResult
}

/*
const testData = {
    _id: "123123",
    title: "Bananer eller epler",
    Votes: 5,
    owner: "Stian",
    double: 2.4
};

insertOne(testData, "Vote")
*/
/*
const docs = [
    { "_id": 123, "color": "red"},
    { "_id": 212, "color": "red"},
    { "_id": 1214, "color": "yellow"},
    { "_id": 351251, "color": "yellow"}
]

const docss = 
    {"color": "yellow"};


//insertMany(docs, "Vote")

deleteOneByObject(docss, "Vote")
*/

}
