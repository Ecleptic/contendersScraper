'use strict';
const Nightmare = require('nightmare')
const nightmare = Nightmare({
    show: false,
    openDevTools: false
})
const redis = require('redis')
const redisClient = redis.createClient(process.env.REDIS_URL || '//localhost:6379')
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = express.Router() // get an instance of the express Router
const http = require('http').Server(app);
const io = require('socket.io')(http)


app.use(bodyParser.urlencoded({extended: true}))
// app.use(bodyParser({limit: '60000mb'}))
app.use(bodyParser.json())

redisClient.on('ready', function () {
    console.log("Redis is ready")
})

redisClient.on('error', function () {
    console.log("Error in Redis")
})

const port = process.env.PORT || 8080 // set our port

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
        // console.log(JSON.parse(reply))
        // console.log(reply)
        res.json(reply)
    })
};

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
app.listen(port)
console.log('Magic happens on port ' + port)













redisClient.on('connect', function () {
    console.log('connected to redis')
})

redisClient.on('error', function () {
    console.log("Error in Redis")
})

console.log("starting nightmare")

startScrape()

function startScrape() {
    nightmare
        .goto('https://www.overwatchcontenders.com/en-us/')
        .wait('.match-schedule-ticker')
        .evaluate(() => {
            console.log("beginning evaluate")
            const gamesList = [
                'AUG 20',
                'AUG 20',
                'AUG 20',
                'AUG 20',
                'AUG 26',
                'AUG 26',
                'AUG 26',
                'AUG 26',
                'AUG 27',
                'AUG 27',
                'AUG 27',
                'AUG 27',
                'SEP 1',
                'SEP 1',
                'Sep 2',
                'Sep 2',
                'Sep 2',
                'Sep 2',
                'SEP 3',
                'SEP 3',
                'SEP 3',
                'SEP 3',
                'SEP 8',
                'SEP 8',
                'SEP 9',
                'SEP 9',
                'SEP 9',
                'SEP 9',
                'SEP 10',
                'SEP 10',
                'SEP 10',
                'SEP 10',
                'SEP 15',
                'SEP 15',
                'SEP 16',
                'SEP 16',
                'SEP 16',
                'SEP 16',
                'SEP 17',
                'SEP 17',
                'SEP 17',
                'SEP 17',
                'SEP 22',
                'SEP 22',
                'SEP 23',
                'SEP 23',
                'SEP 23',
                'SEP 23',
                'SEP 24',
                'SEP 24',
                'SEP 24',
                'SEP 24'
            ]
            let matchesArray = []
            matches = document.querySelectorAll('.match')
            for (let game in matches) {
                if (game > -10000 || game < 10000) {
                    team1Name = (matches[game].querySelector(':scope > a > .team:nth-child(1) > .team-name > .hidden-xs').innerHTML)
                    team1Score = (matches[game].querySelector(':scope > a > .team:nth-child(1) > .team-score').innerHTML)
                    team2Name = (matches[game].querySelector(':scope > a > .team:nth-child(2) > .team-name > .hidden-xs').innerHTML)
                    team2Score = (matches[game].querySelector(':scope > a > .team:nth-child(2) > .team-score').innerHTML)
                    gameTime = (matches[game].querySelector(':scope > a > .match-time > .moment').innerHTML.slice(0, -4) + " EST")
                    if (team1Score != '-' && team2Score != '-') {
                        if (team1Score > team2Score) {
                            teamWin = 'team1'
                        } else {
                            teamWin = 'team2'
                        }
                    } else {
                        teamWin = '-'
                    }
                    gameDate = gamesList[game]

                    let currentMatch = {
                        'Team1': team1Name,
                        'Team2': team2Name,
                        'Team2Score': team2Score,
                        'Team1Score': team1Score,
                        'matchTime': gameTime,
                        'teamWin': teamWin,
                        'gameDate': gameDate
                    }
                    matchesArray.push(currentMatch)
                }

            }

            return matchesArray
        })
        .then((contendersObject) => {
            // console.log(contendersObject)
            console.log("scrape success")
            redisClient.set("contendersObject", JSON.stringify(contendersObject), (err, reply) => {
                console.log("reply: "+reply)
                // redisClient.quit()
            })
            fs.writeFileSync("contendersObject.json", JSON.stringify(contendersObject), (err) => {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            })
            setTimeout(() => {
                startScrape();
            }, 15432);

        })
        .catch((error) => {
            console.error('search failed:', error)
        })
}