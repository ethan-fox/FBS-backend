const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const logger = require('logger').createLogger();
const datejs = require('datejs')

logger.setLevel('debug');

const Schema = mongoose.Schema;

const mongoConnectionUrl = 'mongodb://localhost:27017';
const mongoDbName = 'FBS_test_db';

mongoose.connect(mongoConnectionUrl);

const personSchema = new Schema({
    name: String,
    weight: Number
});

var Person = mongoose.model('People', personSchema);

// personSchema.methods.getWeight = function(cb){
//     return this.model('People').find({weight: this.weight}, cb);
// }

var jeffPerson = new Person({ name: "Jeff",
                            weight: 420 })

console.log(jeffPerson.weight);

// jeffPerson.getWeight(function(err, weight){
//     logger.info(weight);    
// });

// const MongoClient = require('mongodb').MongoClient;

// const mongoConnectionUrl = 'mongodb://localhost:27017';
// const mongoDbName = 'FBS_test_db';
// const mongoClient = new MongoClient(mongoConnectionUrl);
// var mongoDataBase;

// mongoClient.connect(function (err) {

//     console.log("Connected successfully to DB server");

//     mongoDataBase = mongoClient.db(mongoDbName);

//     postArticle(mongoDataBase, obj)

//     mongoClient.close();
// });

// function postArticle(db, postObj){
//     const collection = db.collection('articles');
//     collection.insertOne(postObj, function(err, res){
//             console.log('Inserted Doc into collection');
//             console.log('Result:')
//             console.log(res.result);
//             console.log('Ops:')
//             console.log(res.ops);
//         });
// }

// var collection = mongoDataBase.collection('articles');
// collection.insertOne({ x: 1 })
// console.log(collection.find())