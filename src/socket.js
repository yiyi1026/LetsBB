const io = require('socket.io-client')

export default function () {
  // const socket = io.connect('https://letsbb.herokuapp.com:3000')
  // const socket = io.connect('http://localhost:3000')
  let url = window.location.origin
  if (window.location.port !== '') {
    url = url.replace(window.location.port, '3000')
  }
  const socket = io.connect(url)

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb) {
    socket.emit('message', { chatroomName, message: msg }, cb)
  }

  function getChatrooms(cb) {
    socket.emit('chatrooms', null, cb)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  function login(userId, password, cb) {
    socket.emit('login', {userId, password}, cb)
  }

  return {
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAvailableUsers,
    login,
    registerHandler,
    unregisterHandler
  }
}
