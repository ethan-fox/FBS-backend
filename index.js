const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const logger = require('logger').createLogger();

// Logger setup
logger.setLevel('debug');

// MongoDB setup
const mongoConnectionUrl = 'mongodb://localhost:27017';
const mongoDbName = 'FBS_test_db';
const mongoClient = new MongoClient(mongoConnectionUrl, { useNewUrlParser: true });
var collection, mongoDataBase;

// Express setup
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text()); // for parsing plain text (in this app: markdown)
app.use(function (req, res, next) { // this is the only way to fix the CORS issue :(
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {

    logger.info('GET /');

    res.status(200).send({ 'message': 'You\'ve hit the root endpoint of this API. Nothing is here!' });
});

app.get('/getAllArticleIDs', async function (req, res) {

    logger.info('GET /getAllArticleIDs')

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

    logger.info('POST /getArticleByID')

    await collection.find(ObjectId(req.body.id)).toArray()
        .then(data => {
            logger.debug(data);
            res.send(data[0]);
        });
});

app.post('/postArticle', async function (req, res) {

    logger.info('POST /postArticle')

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

    logger.info('DELETE /deleteArticle')

    await collection.deleteOne(req.body, async function (err, result) {

        // console.log(req.body)
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

var listen_port = process.env.PORT || 8080;

var server = app.listen(listen_port, async function () {
    await mongoClient.connect();

    mongoDataBase = mongoClient.db(mongoDbName);

    collection = mongoDataBase.collection('articles');

    var port = server.address().port;
    logger.info('FBS backend listening on port', port);
});