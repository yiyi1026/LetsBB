/* eslint-disable no-console */
const express = require('express')
const webpack = require('webpack');
// const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');
const cors = require('cors')

const app = express();

app.use(cors({
  origin(origin, callback) {
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

const server = require('http').createServer(app)
const io = require('socket.io')(server)
const config = require('./webpack.config.js');

const compiler = webpack(config);

/**
 * Tell express to use the webpack-dev-middleware and use the webpack.config.js
configuration file as a base.
 *
 *
 *
 *
 * * */

app.use(webpackDevMiddleware(compiler, {
  open: true,
  stats: {
    colors: true
  },
  // host: 'localhost',
  transportMode: 'ws',
  injectClient: false,
  publicPath: config.output.publicPath
}));

const ClientManager = require('./server/ClientManager')
const ChatroomManager = require('./server/ChatroomManager')
const makeHandlers = require('./server/handlers')

const clientManager = ClientManager()
const chatroomManager = ChatroomManager()

// app.get('/', function (req, res) {
//   res.sendFile(HTML_FILE)
// })

const port = process.env.PORT || 3000

io.on('connection', function (client) {
  const {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
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
