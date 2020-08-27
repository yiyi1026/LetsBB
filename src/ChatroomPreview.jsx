import { Paper } from '@material-ui/core'
import { Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  cursor: pointer;
`
const useStyles = makeStyles({
  card: {},
  media: {
    minHeight: 140,
  },
})

export default ({ chatroom, onEnter }) => {
  const classes = useStyles()
  return (
    <Paper style={{ minWidth: 500, marginBottom: 40 }} elevation={1}>
      <Wrapper onClick={onEnter}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia className={classes.media} image={chatroom.image} />
            <CardContent></CardContent>
          </CardActionArea>
          <CardActions>{chatroom.name}</CardActions>
        </Card>
      </Wrapper>
    </Paper>
  )
}
