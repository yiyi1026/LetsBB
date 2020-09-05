import { Box } from '@material-ui/core'
import React from 'react'

export default function Cell(props) {
  const { value } = props
  return (
    <Box display="flex" width={1 / 9} justifyContent="center" alignItems="center">
      {value}

    </Box>
  )
}
