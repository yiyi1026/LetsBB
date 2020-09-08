/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import {
  Avatar,
  Button,
  Divider,
  Fab,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import styled from 'styled-components'

import Overlay from './Overlay'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
})
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
      chatHistory: chatHistory || {},
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
    if (this.props.user.id !== entry.user.id) {
      this.state.unread += 1

      document.title = `(${this.state.unread}) LetsBB`
    }

    this.setState({
      chatHistory: this.state.chatHistory.concat(entry)
    })
    console.log(this.state.chatHistory)
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

            {/* <IconButton color="primary" onClick={this.props.onLeave}>
              <CloseIcon />
            </IconButton> */}
          </Header>

          <ChatroomImage src={this.props.chatroom.image} alt="" />

          <ChatPanel>
            <Scrollable
              innerRef={(panel) => {
                this.panel = panel
              }}
            >
              <List>
                {this.state.chatHistory?.map(
                  ({ user, message, time, event }, i) => [
                    <NoDots key="nodots">
                      <ListItem
                        key={i}
                        style={{
                          color: '#fafafa'
                        }}
                      >
                        <ListItemAvatar key="avatar">
                          <Avatar src={user.image} alt="" className={useStyles.avatar}>
                            {/* <PersonIcon /> */}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          key="user-signature"
                          primary={`${user.id} ${event || ''} ${
                            time || ''
                          } `}
                          secondary={message}
                        />
                      </ListItem>
                    </NoDots>,

                    <Divider key="divider" variant="inset" component="li" />
                  ]
                )}
              </List>
            </Scrollable>

            <InputPanel>
              <TextField
                label="Enter a message."
                multiline
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
