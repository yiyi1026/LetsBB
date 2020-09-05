import React from 'react'
import Cell from './Cell'
import { Box } from '@material-ui/core'

export default function Sudoku(props) {

    return (
        <div width="100%">
            <Box width="100%" display="flex" flexDirection="column">
                {[...Array(9).keys()].map(r => {
                    
                    return <Box key={"row"+r} display="flex" flexDirection="row" width="100%"  justifyContent="center">
                        {[...Array(9).keys()].map(c => {
                            return <Cell className="column" key={c} x={r} y={c} value={2}/>
                        })}
                    </Box>
                })}
            </Box>
                </div>
    );
}