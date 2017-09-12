'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router() // get an instance of the express Router
const redis = require('redis')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const redisClient = redis.createClient(process.env.REDIS_URL || '//localhost:6379')

app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser({limit: '60000mb'}))
app.use(bodyParser.json())

redisClient.on('ready', function () {
    console.log("Redis is ready")
})

redisClient.on('error', function () {
    console.log("Error in Redis")
})

const port = process.env.PORT || 8081 // set our port

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

router.get('/', function (req, res) {
    res.json({message: 'Hello World! API is Live!'})
})

router.use(function (req, res, next) {
    // console.log('Something is happening.')
    next() // make sure we go to the next routes and don't stop here
})

router.route('/API')
// .post(mailer.getTest)
    .post(logIt)
    .get(logIt)

router
    .route('/TEST')
    .post(returnTest)

function returnTest(req, res) {
    res.json(200)
}

function logIt(req, res) {
    // console.log('allowed') let payload = JSON.parse(req.query.payload)
    redisClient.get("contendersObject", (err, reply) => {
        console.log(JSON.parse(reply))
        
        res.json(reply)
    })
}

function acceptIncoming(number) { //TODO: finish the PARAMS
    //TODO: finish this sucker
    if (req.query.lenth) {
        incomingNumberofObjects = req
            .query
            .length
            .json(200)
    } else if (typeof(incomingNumberofObjects) === 'number') {
        while (numloops <= incomingNumberofObjects) {}
    }
}

app.use('/api', router)

// START THE SERVER
// =============================================================================
app.listen(port,()=>{
    console.log('Server listening on ' + port)
})