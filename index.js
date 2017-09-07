const http = require('http')
const parseString = require('xml2js').parseString

const nfl = {
  hostname: 'www.nfl.com',
  path: '/liveupdate/scorestrip/ss.xml',
  method: 'GET'
}

const getGames = function getGames(xml) {
  let games

  parseString(xml.join(''), (err, data) => {
    if (err) return console.error(err)
    return games = data.ss.gms[0].g
  })

  return games
}

const pickTeam = function pickTeam(games) {
  const gameNumber = getRandomInt(0, 15)
  const side = getRandomInt(0, 1) ? 'hnn' : 'vnn'
  return games[gameNumber]['$'][side]
}

const getRandomInt = function getRandomInt(min, max) {
  min = Math.ceil(min) //inclusive min
  max = Math.floor(max + 1) //inclusive max
  return Math.floor(Math.random() * (max - min)) + min
}

const req = http.request(nfl, (res) => {
  let xml = []

  res.setEncoding('utf8')
  res.on('data', body => xml.push(body))
  res.on('end', () => {
    const games = getGames(xml)

    console.log(`For this week, your pick is: ${pickTeam(games)}`)
    console.log(`Don't lose :)`)
  })
})

req.on('error', (err) => {
  console.log(`Error: ${err.message}`)
})

req.end()
