const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const logger = require('morgan')
const favicon = require('serve-favicon')
const compression = require('compression')
const helmet = require('helmet')
const path = require('path')
const ifaces = require('os').networkInterfaces()
const question = require('./api/v1/question')
const subwordsData = require('./public/resources/subwordsV2.json')
const swMap = require('./public/resources/wordMap.json')

const port = 5000
const host = '0.0.0.0'
const views = path.join(`${__dirname}/public/html`)

// Middleware setup
app.use(express.static(`${__dirname}/public`))
app.use(express.static(`${__dirname}/public/resources`))
app.use(express.static(`${__dirname}/public/css`))
app.use(logger('dev'))
app.use(favicon(path.join(__dirname, 'public', 'resources', 'favicon.ico')))
app.use(compression())
app.use(helmet())
app.use('/questions', question)

// Socket.io Goo
// Wolverine FEUD game state
let gameState = {
  currentQuestion: {
    question: 'Please wait, the judge will start the game shortly',
    answers: [
      {
        text: 'Demo Text',
        value: 100
      }
    ]
  },
  players: []
}

io.on('connection', function(socket){
  console.log('a user connected')
  socket.on('new question', function( question ) {
    gameState.currentQuestion = question
    console.log('question: ' + gameState.currentQuestion.question)
    socket.broadcast.emit('broadcast new question', gameState)
  })

  // Wolverine FEUD goo
  socket.on('start game', function(teams) {
    gameState.players = teams
    gameState.players.forEach(function(player) {
      console.log(player.name)
      console.log(player.team)
    })
  })

  socket.on('get players', function() {
    console.log('signal received sending: ' + gameState.players)
    socket.emit('giving players', gameState)
  })

  socket.on('new card state', function(flipped) {
    console.log('server new card state')
    socket.broadcast.emit('new card state', flipped)
  })

  socket.on('award points', function(teamNum) {
    socket.broadcast.emit('points awarded', teamNum)
  })

  socket.on('disconnect', function() {
    console.log('user disconnected')
  })

  // Subwords Socket.io goo
  socket.on('player registered', function(registration) {
    socket.join(registration.room)
    socket.broadcast.to(registration.room).emit('player ready', registration.name)
  })

  socket.on('guess subword', function(room, player, guess, word) {
    let subwordIndex = swMap[guess]
    let pass = word.subwords.includes(subwordIndex)
    console.log(pass)
    if (pass) {
      let points = guess.length
      console.log(points)
      socket.broadcast.to(room).emit('correct guess', player, points, guess)
    }
  })

  socket.on('subwords started', function(players, room) {
    socket.broadcast.to(room).emit('players incoming', players)
    lastRoom.room = room
    lastRoom.players = players
  })

  socket.on('new word', function(room, word) {
    socket.broadcast.to(room).emit('new word sent', word)
  })

})

// Routing
app.get('/', (req, res) => {
  res.sendFile(`${views}/index.html`)
})

app.get('/host', (req, res) => {
  let ipAddress = ''
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if(ifname === 'en0') {
        ipAddress = iface.address
      }
    })
  })
  let resObject = {
    interfaceName: 'en0',
    ipAddr: ipAddress
  }
  res.send(resObject)
})

// Wolverine Feud routing
app.get('/feud', (req, res) => {
  res.sendFile(`${views}/gameLobby.html`)
})

app.get('/judge', (req, res) => {
  res.sendFile(`${views}/judge.html`)
})

app.get('/tvView', (req, res) => {
  res.sendFile(`${views}/tvView.html`)
})

app.get('/admin', (req, res) => res.sendFile(`${views}/admin.html`))

// Subwords routing
app.get('/subwords', (req, res) => {
  res.sendFile(`${views}/subwordsStart.html`)
})

app.get('/subwords-tv', (req, res) => {
  res.sendFile(`${views}/Subwords.html`)
})

app.get('/subwords-player', (req, res) => {
  res.sendFile(`${views}/subwordsPlayer.html`)
})

app.get('/new-word', (req, res) => {
  let wordObject = subwordsData[Math.floor(Math.random() * subwordsData.length)]
  res.send(wordObject)
})

app.get('/last-room', (req, res) => {
  res.send(lastRoom)
})

app.get('*', (req, res) => {
  res.sendFile(`${views}/404.html`)
})

let lastRoom = {room: 1234, players: []}

http.listen(port, host, () => {
  console.log(`Listening on port: ${port}`)
}) 