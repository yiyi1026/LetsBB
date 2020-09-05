import { Box } from '@material-ui/core'
import React from 'react'

import Cell from './Cell'

export default function Sudoku(props) {
  return (
    <div width="100%" style={{ height: 600 }}>
      <Box style={{ width: 500, height: 450 }} display="flex" flexDirection="column">
        {[...Array(9).keys()].map((r) => (
          <Box key={`row${r}`} display="flex" flexDirection="row" width="100%" height="100%" justifyContent="center">
            {[...Array(9).keys()].map((c) => <Cell className="column" key={c} x={r} y={c} value={2} />)}
          </Box>
        ))}
      </Box>
    </div>
  );
}
