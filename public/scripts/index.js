window.onload = () => {
  if ('serviceWorker' in navigator) {
    console.log('CLIENT: service worker registration in progress.');
    navigator
      .serviceWorker
      .register('/scripts/sw.js')
      .then(function () {
        console.log('CLIENT: service worker registration complete.');
      }, function () {
        console.log('CLIENT: service worker registration failure.');
      });
  } else {
    console.log('CLIENT: service worker is not supported.');
  }
  const url = "/api/API"
  let table = document.querySelector('.teamList')
  let loadingWord = document.querySelector('.loading')
  try {
    fetch(url).then((response) => {
      Promise
        .resolve(response.json())
        .then((res) => {
          res = JSON.parse(res)
          loadingWord.innerHTML = ""
          for (i in res) {
            let table1 = document.createElement('tr')
            let table2 = document.createElement('tr')
            let team1Name = document.createElement('td')
            let team1Score = document.createElement('td')
            let team2Name = document.createElement('td')
            let team2Score = document.createElement('td')
            let matchDate = document.createElement('th')
            let blankDate = document.createElement('th')

            gameDateTime = res[i].gameDate + ",  " + res[i].matchTime

            matchDate.innerHTML = gameDateTime
            team1Name.innerHTML = res[i].Team1
            team1Score.innerHTML = res[i].Team1Score
            team2Name.innerHTML = res[i].Team2
            team2Score.innerHTML = res[i].Team2Score

            if (res[i].Team2Score > res[i].Team1Score && res[i].Team1Score + res[i].Team2Score >= 4) {
              console.log("team2Win")
              team2Score.className += " win "
            } else if (res[i].Team1Score > res[i].Team2Score && res[i].Team1Score + res[i].Team2Score >= 4) {
              console.log("team1Win")
              team1Score.className += " win "
            }

            matchDate.className += " matchDate "
            blankDate.className += " blankDate "
            matchDate.className += " date "
            team1Score.className += " team1 score "
            team2Score.className += " team2 score "
            team1Name.className += " team1 name "
            team2Name.className += " team2 name "
            table1.className += " team1 "
            table2.className += " team2 "

            table1.appendChild(team1Name)
            table1.appendChild(team1Score)
            table2.appendChild(team2Name)
            table2.appendChild(team2Score)

            table.appendChild(matchDate)
            table.appendChild(blankDate)
            table.appendChild(table1)
            table.appendChild(table2)
          }
        })
    }).catch((err) => {
      console.log("Fetch Error:", err)
    })
  } catch (e) {
    console.log("Cotrdn't use fetch")
  }
}