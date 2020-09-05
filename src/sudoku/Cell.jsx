import { Box } from '@material-ui/core'
import React from 'react'

export default function Cell(props) {
    let {value, onClick, selected} = props
    let bgcolor = "white"
    if(selected){
        bgcolor = "primary.main"
    }
    return (
        <Box width={1/9} onClick={onClick} bgcolor={bgcolor}
            display="flex" width={1 / 9} justifyContent="center" alignItems="center">
            {value}
        </Box>
    )

}
