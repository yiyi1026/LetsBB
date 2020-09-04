const userTemplates = require('./config/users')

module.exports = function () {
  // mapping of all connected clients
  const clients = new Map()

  function addClient(client) {
    clients.set(client.id, {
      client
    })
  }

  function registerClient(client, user) {
    clients.set(client.id, {
      client, user
    })
  }

  function removeClient(client) {
    clients.delete(client.id)
  }

  function getAvailableUsers() {
    const usersTaken = new Set(
      Array.from(clients.values())
        .filter((c) => c.user)
        .map((c) => c.user.id)
    )
    return userTemplates
      .filter((u) => !usersTaken.has(u.id))
  }

  function login(userId, pass){
    const user = userTemplates.find(el => el.id == userId)
    console.log(userId, pass)
    if(user){
      const bcrypt = require('bcrypt');
      let result = bcrypt.compareSync(pass, user.password);
      if(result) {
        // console.log("match")
        return true;
      } else{
        // console.log("pass not match")
        return false;
      }
    } else {
      // console.log("user not find")
      return false;
    }
  }

  function isUserAvailable(userId) {
    return getAvailableUsers().some((u) => u.id === userId)
  }

  function getUserById(userId) {
    return userTemplates.find((u) => u.id === userId)
  }

  function getUserByClientId(clientId) {
    return (clients.get(clientId) || {
    }).user
  }

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    login,
    isUserAvailable,
    getUserById,
    getUserByClientId
  }
}
