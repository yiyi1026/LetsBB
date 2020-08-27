/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import { Avatar, Divider, Fab, Icon, List, ListItem } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import React from 'react'
import styled from 'styled-components'

import Overlay from './Overlay'

const ChatWindow = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 800px;
  box-sizing: border-box;
`

const ChatPanel = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  z-index: 1;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20px;
  z-index: 1;
  color: #fafafa !important;
  border-bottom: 1px solid;
`

const Title = styled.p`
  text-align: center;
  font-size: 24px;
`

const NoDots = styled.div`
  hr {
    visibility: hidden;
  }
`

const OutputText = styled.div`
  white-space: normal !important;
  word-break: break-all !important;
  overflow: initial !important;
  width: 100%;
  height: auto !important;
  color: #fafafa !important;
`

const InputPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  align-self: center;
  border-top: 1px solid #fafafa;
`

const ChatroomImage = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
`

const Scrollable = styled.div`
  height: 100%;
  overflow: auto;
`

export default class Chatroom extends React.Component {
  constructor(props, context) {
    super(props, context)

    const { chatHistory } = props

    this.state = {
      chatHistory,
      input: '',
      unread: 0
    }

    this.onInput = this.onInput.bind(this)

    this.onMouseMove = this.onMouseMove.bind(this)

    this.onSendMessage = this.onSendMessage.bind(this)

    this.onMessageReceived = this.onMessageReceived.bind(this)

    this.updateChatHistory = this.updateChatHistory.bind(this)

    this.scrollChatToBottom = this.scrollChatToBottom.bind(this)
  }

  componentDidMount() {
    this.props.registerHandler(this.onMessageReceived)

    this.scrollChatToBottom()
  }

  componentDidUpdate() {
    this.scrollChatToBottom()
  }

  componentWillUnmount() {
    this.props.unregisterHandler()
  }

  onMouseMove(_) {
    if (this.state.unread > 0) {
      this.state.unread = 0

      document.title = 'LetsBB'
    }
  }

  onInput(e) {
    this.setState({
      input: e.target.value
    })
  }

  onSendMessage() {
    if (!this.state.input) return

    this.props.onSendMessage(this.state.input, (err) => {
      if (err) return console.error(err)

      return this.setState({
        input: ''
      })
    })
  }

  onMessageReceived(entry) {
    console.log('onMessageReceived:', entry)

    this.updateChatHistory(entry)
  }

  updateChatHistory(entry) {
    if (this.props.user.name !== entry.user.name) {
      this.state.unread += 1

      document.title = `(${this.state.unread}) LetsBB`
    }

    this.setState({
      chatHistory: this.state.chatHistory.concat(entry)
    })
  }

  scrollChatToBottom() {
    if (this.panel) {
      this.panel.scrollTo(0, this.panel.scrollHeight)
    }
  }

  render() {
    return (
      <div
        style={{
          height: '100%'
        }}
      >
        <ChatWindow onMouseMove={this.onMouseMove}>
          <Header>
            <Title>{this.props.chatroom.name}</Title>

            <Button
              variant="contained"
              primary
              icon={(
                <Icon
                  style={{
                    fontSize: 24
                  }}
                  className="material-icons"
                >
                  close
                </Icon>
              )}
              onClick={this.props.onLeave}
            />
          </Header>

          <ChatroomImage src={this.props.chatroom.image} alt="" />

          <ChatPanel>
            <Scrollable
              innerRef={(panel) => {
                this.panel = panel
              }}
            >
              <List>
                {this.state.chatHistory.map(
                  ({ user, message, time, event }, i) => [
                    <NoDots>
                      <ListItem
                        key={i}
                        style={{
                          color: '#fafafa'
                        }}
                        leftAvatar={<Avatar src={user.image} />}
                        primaryText={`${user.name} ${event || ''} ${
                          time || ''
                        } `}
                        secondaryText={
                          message && <OutputText>{message}</OutputText>
                        }
                      />
                    </NoDots>,

                    <Divider inset />
                  ]
                )}
              </List>
            </Scrollable>

            <InputPanel>
              <TextField
                textareaStyle={{
                  color: '#fafafa'
                }}
                hintStyle={{
                  color: '#fafafa'
                }}
                floatingLabelStyle={{
                  color: '#fafafa'
                }}
                hintText="Enter a message."
                floatingLabelText="Enter a message."
                multiLine
                rows={4}
                rowsMax={4}
                onChange={this.onInput}
                value={this.state.input}
                onKeyPress={(e) => (e.key === 'Enter' ? this.onSendMessage() : null)}
              />

              <Fab
                onClick={this.onSendMessage}
                style={{
                  marginLeft: 20
                }}
              >
                <Icon
                  style={{
                    fontSize: 32
                  }}
                  className="material-icons"
                >
                  chat_bubble_outline
                </Icon>
              </Fab>
            </InputPanel>
          </ChatPanel>

          <Overlay opacity={0.6} background="#111111" />
        </ChatWindow>
      </div>
    )
  }
}
