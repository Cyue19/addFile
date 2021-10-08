const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { MongoClient } = require('mongodb');
const testFile = require("./example.json");
const uri = "add url here";

// exports.handler = async (event) => {
//     await addToMongo(event);
// }

async function addToMongo(data) {
    //create json object
    var fileEvent = data["Records"][0];
    var filePath = (fileEvent['s3']['object']['key']);

    var index = filePath.lastIndexOf("/");
    var fileName = filePath.substr(index+1,);
    var location = filePath.substr(0, index+1);
    var lastModified = fileEvent["eventTime"];
    var size = fileEvent['s3']['object']['size'];
    var eTag = fileEvent['s3']['object']['eTag'];

    const doc = {
        "eTag": eTag,
        "fileName": fileName,
        "location": location,
        "lastModified": lastModified,
        "size": size
    }

    //send doc to mongodb
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const clientPromise = client.connect();
    client = await clientPromise;
    client.connect(err => {
        client.db("Besi-C").collection("Files").insertOne(doc, (err, res) => {
            if (err)
                throw err;
            console.log(`Inserted: ${res} rows`);
            client.close();
        });
    });

}

addToMongo(testFile);