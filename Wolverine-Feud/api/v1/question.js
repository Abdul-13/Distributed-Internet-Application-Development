const express = require('express')
const bodyParser = require('body-parser')
const mongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId; 
const router = express.Router()

const jsonParser = bodyParser.json()
const urlParser = bodyParser.urlencoded({ extended: true })

// Database connection
const url = `mongodb://127.0.0.1:27017/`
let dbo = undefined
mongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err
  dbo = db.db('feud_db')
  console.log("Connected to db")
})

// GET List
router.get('/', function(req, res) {
  dbo.collection('questions').find({}).toArray( function(err, result) {
    if (err) throw err
    res.send(result)
  })
})

// GET Random
router.get('/random', function(req, res) {
  let cursor = dbo.collection('questions').aggregate([{$sample: {size: 1}}])
  cursor.toArray(function(err, result) {
    if (err) throw err
    res.status(307)
    res.send(result)
  })
})

// GET By Id
router.get('/:id', function(req, res) {
  let id = req.params.id
  dbo.collection('questions').find({ _id: new ObjectId(id) }).toArray(function(err, result) {
    if (err) throw err
    res.send(result)
  })
})

// POST
router.post('/', urlParser, function(req, res) {
  dbo.collection('questions').insertOne(req.body, function(err, result) {
    if (err) throw err
    res.send(result.insertedId)
  })
})

// PUT
router.put('/:id', jsonParser, function(req, res) {
  let id = req.params.id
  let question = req.body
  dbo.collection('questions').updateOne( { _id: new ObjectId(id) }, { $set: question } , function(err) {
    if (err) throw err
    console.log(`Successfully updated item: ${id}`)
    res.send(question)
  })
})

// DELETE
router.delete('/:id', function(req, res) {
  let id = req.params.id
  dbo.collection('questions').deleteOne({ _id: new ObjectId(id) }, function(err) {
    if (err) throw err
    res.send(`Successfully deleted object with id: ${id}`)
  })
})

module.exports = router