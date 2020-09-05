import React from 'react'
import { Box } from '@material-ui/core'

export default function Cell(props) {
    let value = props.value
    let onClick = props.onClick
    let bgcolor = "white"
    if(props.selected){
        bgcolor = "primary.main"
    }
    return (
        <Box width={1/9} onClick={onClick} bgcolor={bgcolor}>
            {value}
        </Box>
    )
}