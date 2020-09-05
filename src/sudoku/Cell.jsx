import { Box } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase';
import {blue} from '@material-ui/core/colors';
import React from 'react'


export default function Cell(props) {
  let { x, y, value, onClick, selected,
    isPeer, isFixed, isTentative } = props
  let bgcolor = 'white'
  let color = 'info.main'
  let fontSize = 32
  let borderTop = null
  let borderBottom = null
  let borderLeft = null
  let borderRight = null
  if (isPeer) {
    bgcolor = blue[100]
  }
  if (selected) {
    bgcolor = blue[200]
  }
  if (isFixed) {
    color = 'text.primary'
  }
  if (isTentative) {
    color = 'text.secondary'
    fontSize = 18
  }
  if (x % 3 == 0) {
    borderTop = 2
  } else if (x == 8) {
    borderBottom = 2
  }
  if (y % 3 == 0) {
    borderLeft = 2
  } else if (y == 8) {
    borderRight = 2
  }
  const handleChange = (e) => {
    console.log('onchange')
  }

  return (
    <Box onClick={onClick} onChange={handleChange} bgcolor={bgcolor}
      display='flex' width={1 / 9} justifyContent='center' alignItems='center'
      border={1} borderTop={borderTop} borderBottom={borderBottom}
      borderLeft={borderLeft} borderRight={borderRight} borderColor='text.secondary' fontSize={fontSize} >
      <Box color={color}>
        <span style={{
          display: 'block',
          wordBreak: 'break-all'
        }}>
          <strong>
            {value != 0 ? value : ''}
          </strong>
        </span>
      </Box>
    </Box>


  )

}
