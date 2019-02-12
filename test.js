const MongoClient = require('mongodb').MongoClient;

const mongoConnectionUrl = 'mongodb://localhost:27017';
const mongoDbName = 'FBS_test_db';
const mongoClient = new MongoClient(mongoConnectionUrl);
var mongoDataBase;

mongoClient.connect(function (err) {

    console.log("Connected successfully to DB server");

    mongoDataBase = mongoClient.db(mongoDbName);

    postArticle(mongoDataBase, obj)

    mongoClient.close();
});

function postArticle(db, postObj){
    const collection = db.collection('articles');
    collection.insertOne(postObj, function(err, res){
            console.log('Inserted Doc into collection');
            console.log('Result:')
            console.log(res.result);
            console.log('Ops:')
            console.log(res.ops);
        });
}

// var collection = mongoDataBase.collection('articles');
// collection.insertOne({ x: 1 })
// console.log(collection.find())