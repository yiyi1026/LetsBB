import { List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import { Avatar } from '@material-ui/core'
import { Dialog, DialogTitle } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { blue } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import { PersonIcon } from '@material-ui/icons/Person'
import React from 'react'

import Loader from './Loader'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
})

export default class UserSelection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      availableUsers: null,
    }

    this.handleSelection = this.handleSelection.bind(this)
    this.renderUserItems = this.renderUserItems.bind(this)

    this.props.getAvailableUsers((err, availableUsers) => {
      this.setState({ availableUsers })
    })
  }

  handleSelection(selectedUser) {
    this.props.register(selectedUser.name)
  }

  renderUserItems() {
    return this.state.availableUsers.map((user) => (
      <ListItem
        autoFocus
        button
        onClick={() => this.handleSelection(user)}
        // secondaryText={user.statusText}
        key={user.name}
      >
        <ListItemAvatar>
          <Avatar src={user.image} alt="">
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.name} secondaryText={user.statusText} />
      </ListItem>
    ))
  }

  render() {
    return (
      <Dialog
        // style={{ minWidth: 400 }}
        onClose={() => this.props.close}
        open={true}
      >
        <DialogTitle id="choose-user-title">Pick your character.</DialogTitle>>
        {!this.state.availableUsers ? (
          <Loader />
        ) : (
          <List>{this.renderUserItems()}</List>
        )}
      </Dialog>
    )
  }
}
