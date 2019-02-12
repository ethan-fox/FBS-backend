const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 

var mongoConnectionUrl = 'mongodb://localhost:27017';
var mongoDbName = 'FBS_test_db';

const mongoClient = new MongoClient(mongoConnectionUrl);

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text());

app.get('/', function (req, res) {
    res.status(200).send({ 'message': 'You\'ve hit the root endpoint of this API. Nothing is here!' });
});

app.get('/getAllArticleIDs', async function (req, res) {
    let mongoDataBase = mongoClient.db(mongoDbName);

    let collection = mongoDataBase.collection('articles');

    await collection.find({}).toArray()
        .then(data => {
            for(let i = 0; i < data.length; ++i){
                delete data[i].author;
                delete data[i].content;
            }
            res.status(200).send(data);
        });
});

app.post('/getArticleByID', async function(req, res) {
    let mongoDataBase = mongoClient.db(mongoDbName);

    let collection = mongoDataBase.collection('articles');

    await collection.find(ObjectId(req.body._id)).toArray()
        .then(data => {
            console.log(data);
            res.send(data[0]);
        });
});

app.post('/postArticle', async function (req, res) {

    let mongoDataBase = mongoClient.db(mongoDbName);

    let collection = mongoDataBase.collection('articles');

    let postBody = {
        title: req.query.title,
        author: req.query.author,
        content: req.body
    }

    await collection.insertOne(postBody, async function (err, result) {
        
        let statusCode, resBody;
        if(err){
            console.log("ERROR:",err)
            statusCode = 500
            resBody = {
                'message': 'Could not post article.',
                'error': err
            }
            
        }else{
            console.log('Inserted Doc into collection');
            statusCode = 201
            resBody = {
                'message': 'Successfully posted article.',
                'docId': result.ops[0]._id
            }
        }
        res.status(statusCode).send(resBody)
    });

});

app.delete('/deleteArticle', async function (req, res) {

    let mongoDataBase = mongoClient.db(mongoDbName);

    let collection = mongoDataBase.collection('articles');

    await collection.deleteOne(req.body, async function (err, result) {

        console.log(req.body)
        let statusCode, resMessage
        
        if(err){ 
            console.log("ERROR:", err)
            statusCode = 500;
            resMessage = 'Could not remove article'
        }else if (result.deletedCount === 0){
            statusCode = 400;
            resMessage = 'Article does not exist'
        }else{
            console.log('Removed Doc from collection')
            statusCode = 200;
            resMessage = 'Successfully deleted article'
        }
        res.status(statusCode).send({
            'message': resMessage + ' with criteria: ' + JSON.stringify(req.body)
        });
    });
});
    // mongoClient.connect(async function (err) {
    //     if (err) {
    //         console.log(err);
    //     }

    //     console.log("Connected successfully to DB server");

    //     let mongoDataBase = mongoClient.db(mongoDbName);

    //     // mongoClient.close();
    // });

var listen_port = process.env.PORT || 8080;

var server = app.listen(listen_port, async function () {
    await mongoClient.connect();
    var port = server.address().port;
    console.log('FBS backend listening on port %s', port);
});