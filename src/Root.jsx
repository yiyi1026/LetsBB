import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import Chatroom from './Chatroom'
import Home from './Home'
import Loader from './Loader'
import MainLayout from './MainLayout'
import socket from './socket'
import Login from './Login'

const theme = createMuiTheme({})

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
    this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(
      this
    )

    this.getChatrooms()
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user) return onNoUserSelected()

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err) return console.error(err)
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
      if (err) return onRegisterResponse(null)
      return onRegisterResponse(user)
    })
  }

  renderUserSelectionOrRedirect(renderUserSelection) {
    if (this.state.user) {
      return <Redirect to="/" />
    }

    return this.state.isRegisterInProcess ? <Loader /> : renderUserSelection()
  }

  renderChatroomOrRedirect(chatroom, { history }) {
    if (!this.state.user) {
      return <Redirect to="/" />
    }

    const { chatHistory } = history.location.state

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
                    path="/"
                    render={(props) => (
                      <Home
                        user={this.state.user}
                        chatrooms={this.state.chatrooms}
                        onChangeUser={() => props.history.push('/login')}
                        onEnterChatroom={(chatroomName) => this.onEnterChatroom(
                          chatroomName,
                          () => props.history.push('/login'),
                          (chatHistory) => props.history.push({
                            pathname: chatroomName,
                            state: { chatHistory }
                          })
                        )}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"

                    render={(props) => {
                        const toHome = () => props.history.push('/')
                        return <Login
                                  clientLogin={this.state.client.login}
                                  close={toHome}
                                  register={(name) => this.register(name, toHome)}
                                />
                      }
                    }
                  />
                  {this.state.chatrooms.map((chatroom) => (
                    <Route
                      key={chatroom.name}
                      exact
                      path={`/${chatroom.name}`}
                      render={(props) => this.renderChatroomOrRedirect(chatroom, props)}
                    />
                  ))}
                </Switch>
              )}
          </MainLayout>
        </ThemeProvider>
      </BrowserRouter>
    )
  }
}

export default hot(Root)
