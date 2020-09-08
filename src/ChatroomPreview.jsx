import { Card, CardActionArea, CardActions, CardContent, CardMedia, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  cursor: pointer;
`
const useStyles = makeStyles({
  card: {},
  media: {
    height: 300
  }
})

export default ({ chatroom, onEnter }) => {
  const classes = useStyles()
  return (
    <Paper style={{ minWidth: 500, marginBottom: 40 }} elevation={1}>
      <Wrapper onClick={onEnter}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia className={classes.media} image={chatroom.image} />
          </CardActionArea>
          <CardActions style={{ height: 50 }}>
            <Typography variant="h5" component="h2">
              {chatroom.name}
            </Typography>
          </CardActions>
        </Card>
      </Wrapper>
    </Paper>
  )
}
