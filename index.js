const Nightmare = require('nightmare')
const nightmare = Nightmare({
    show: false,
    openDevTools: false
})
const redis = require('redis')
const client = redis.createClient() //creates a new client

client.on('connect', function () {
    console.log('connected to redis')
});


// const config = require('./config')

let gameDates = {
    'AUG 20': 4,
    'AUG 26': 4,
    'AUG 27': 4,
    'SEP 1': 2,
    'Sep 2': 4,
    'SEP 3': 4,
    'SEP 8': 2,
    'SEP 9': 4,
    'SEP 10': 4,
    'SEP 15': 2,
    'SEP 16': 4,
    'SEP 17': 4,
    'SEP 22': 2,
    'SEP 23': 4,
    'SEP 24': 4
}

let NATeamWins = {}
let EUTeamWins = {}

nightmare
    .goto('https://www.overwatchcontenders.com/en-us/')
    .wait('.match-schedule-ticker')
    .evaluate(() => {
        const gamesList = ['AUG 20', 'AUG 20', 'AUG 20', 'AUG 20', 'AUG 26', 'AUG 26', 'AUG 26', 'AUG 26',
            'AUG 27', 'AUG 27', 'AUG 27', 'AUG 27', 'SEP 1', 'SEP 1', 'Sep 2', 'Sep 2', 'Sep 2', 'Sep 2',
            'SEP 3', 'SEP 3', 'SEP 3', 'SEP 3', 'SEP 8', 'SEP 8', 'SEP 9', 'SEP 9', 'SEP 9', 'SEP 9', 'SEP 10',
            'SEP 10', 'SEP 10', 'SEP 10', 'SEP 15', 'SEP 15', 'SEP 16', 'SEP 16', 'SEP 16', 'SEP 16', 'SEP 17',
            'SEP 17', 'SEP 17', 'SEP 17', 'SEP 22', 'SEP 22', 'SEP 23', 'SEP 23', 'SEP 23', 'SEP 23', 'SEP 24',
            'SEP 24', 'SEP 24', 'SEP 24'
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
                    'Team2Score': team2Name,
                    'Team1Score': team1Score,
                    'matchTime': gameTime,
                    'teamWin': teamWin,
                    'gameDate': gameDate
                }
                matchesArray.push(currentMatch)
            }

        }
        // let a = matches[0].querySelector(':scope > a > .team:nth-child(1) > .team-name > .hidden-xs').innerHTML

        /*
                a = document.querySelector('.match')
                // team = a.querySelector(':scope > a > .team')
                match.team1 = a.querySelector(':scope > a > .team:nth-child(1) > .team-name > .hidden-xs').innerHTML
                match.team2 = a.querySelector(':scope > a > .team:nth-child(2) > .team-name > .hidden-xs').innerHTML
                match.team1Score = a.querySelector(':scope > a > .team:nth-child(1) > .team-score').innerHTML
                match.team2Score = a.querySelector(':scope > a > .team:nth-child(2) > .team-score').innerHTML
                match.time = a.querySelector(':scope > a > .match-time > .moment').innerHTML.slice(0,-4) + " EST"     
        */
        /*
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function demo() {
            console.log('Taking a break...');
            await sleep(2000);
            console.log('Two second later');
        }

        demo();
        */
        return matchesArray
    }).end()
    .then((contendersObject) => {
        console.log(contendersObject)
        // console.log(typeof(variable))
        client.set("contendersObject", contendersObject.toString(), (err, reply) => {
            console.log(reply)
            client.quit()
        })
    })
    .catch((error) => {
        console.error('search failed:', error)
    })