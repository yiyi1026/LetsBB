const express = require('express')

const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const ClientManager = require('./server/ClientManager')
const ChatroomManager = require('./server/ChatroomManager')
const makeHandlers = require('./server/handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`);
})
const port = process.env.PORT || 3000

io.on('connection', function (client) {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleLogin,
    handleDisconnect
  } = makeHandlers(client, clientManager, chatroomManager)

  console.log('client connected...', client.id)
  clientManager.addClient(client)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('leave', handleLeave)

  client.on('message', handleMessage)

  client.on('chatrooms', handleGetChatrooms)

  client.on('availableUsers', handleGetAvailableUsers)

  client.on('login', handleLogin)

  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

server.listen(port, function (err) {
  if (err) throw err
  console.log('listening on port 3000')
})
