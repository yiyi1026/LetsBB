import Link from '@material-ui/core/Link'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import Chatroom from './Chatroom'
import Home from './Home'
import Loader from './Loader'
import Login from './Login'
import MainLayout from './MainLayout'
import socket from './socket'

const theme = createMuiTheme({})
const defaultName="Civ"

class Root extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      user: null,
      isRegisterInProcess: false,
      client: socket(),
      chatrooms: null
    }

    this.onEnterChatroom = this.onEnterChatroom.bind(this)
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
    this.getChatrooms = this.getChatrooms.bind(this)
    this.register = this.register.bind(this)
    this.join = this.join.bind(this)
    this.getChatrooms()
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    console.log(this.state.user)
    if (!this.state.user) return onNoUserSelected()

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err) return console.error(err)
      console.log(chatHistory)
      return onEnterSuccess(chatHistory)
    })
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, (err) => {
      if (err) return console.error(err)
      return onLeaveSuccess()
    })
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms })
    })
  }

  register(name) {
    const onRegisterResponse = (user) => this.setState({ isRegisterInProcess: false, user })
    this.setState({ isRegisterInProcess: true })
    this.state.client.register(name, (err, user) => {
      if (err) {
        return onRegisterResponse(null)}
      return onRegisterResponse(user)
    })
  }

  async join(cb) {
    const chatroomName = "invisible place"
    return this.state.client.join(chatroomName, cb)
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/login" />
    }

    const chatHistory = history.location.state?.chatHistory

    return (
      <Chatroom
        chatroom={chatroom}
        chatHistory={chatHistory}
        user={this.state.user}
        onLeave={() => this.onLeaveChatroom(chatroom.name, () => history.push('/'))}
        onSendMessage={(message, cb) => this.state.client.message(chatroom.name, message, cb)}
        registerHandler={this.state.client.registerHandler}
        unregisterHandler={this.state.client.unregisterHandler}
      />
    )
  }

  render() {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <MainLayout user={this.state.user}>
            {!this.state.chatrooms ? (
              <Loader />
            ) : (
              <Switch>
                <Route
                  exact
                  path="/login"
                  render={(props) => {
                    console.log('login page')
                    const toChatroom = () => props.history.push(`/${defaultName}`)
                    const onEnter = () => this.onEnterChatroom(
                      defaultName,
                      () => props.history.push('/login'),
                      (chatHistory) => props.history.push({
                        pathname: defaultName,
                        state: { chatHistory }}))
                    return (
                      <Login
                        clientLogin={this.state.client.login}
                        close={toChatroom}
                        register={(name) => this.register(name)}
                        join={()=>this.join(()=>onEnter(name))}
                        {...props}
                      />
                    )
                  }}
                />
                {this.state.chatrooms.map((chatroom) => (
                  <Route
                    key={chatroom.name}
                    exact
                    path={`/${chatroom.name}`}
                    render={(props) => this.renderChatroomOrRedirect(chatroom, props)}
                  />
                ))}
                <Route
                  exact
                  path="/"
                  render={(props) => {
                    if(!this.state.user){
                      return <Redirect to="/login"/>
                    }else{
                      const chatroom = this.state.chatroom[0]
                      return this.renderChatroomOrRedirect(this.state.chatrooms[0], props)
                      // return (<Chatroom
                      //   chatroom={chatroom}
                      //   chatHistory={chatHistory}
                      //   user={this.state.user}
                      //   onLeave={() => this.onLeaveChatroom(chatroom.name, () => history.push('/'))}
                      //   onSendMessage={(message, cb) => this.state.client.message(chatroom.name, message, cb)}
                      //   registerHandler={this.state.client.registerHandler}
                      //   unregisterHandler={this.state.client.unregisterHandler}
                      //   />)
                    }

                  }}
                />
              </Switch>
            )}
          </MainLayout>
        </ThemeProvider>
      </BrowserRouter>
    )
  }
}

export default hot(Root)
