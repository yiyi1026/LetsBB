import React from 'react'
import { Box } from '@material-ui/core'

export default function Cell(props) {
    let value = props.value
    return (
        <Box width={1/9} justifyContent="center">
            {value}
        </Box>
    )
}