import { Box } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase';
import React from 'react'

export default function Cell(props) {
  let { value, onClick, selected, isPeer, isFixed, isTentative } = props
  let bgcolor = 'white'
  let color = 'text.primary'
  let fontSize = 16
  if(isPeer){
    bgcolor = 'info.main'
  }
  if (selected) {
    bgcolor = 'primary.main'
  }
  if (isFixed) {
    color = 'text.disabled'
  }
  if (isTentative) {
    color = 'text.secondary'
    fontSize = 12
  }
  const handleChange = (e) => {
    console.log('onchange')
  }

  return (
    <Box onClick={onClick} onChange={handleChange} color={color} bgcolor={bgcolor}
      display='flex' width={1 / 9} justifyContent='center' alignItems='center'
      border={1} borderColor='text.disabled' fontSize={fontSize} >
      <span style={{
          display:'block',
          wordBreak:'break-all'
        }}>
        <strong>
        {value!=0 ? value : ''}
        </strong>
      </span>
    </Box>
  )

}
