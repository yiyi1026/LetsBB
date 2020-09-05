import React, { useState, useEffect } from 'react'
import {
  Box, Table, TableBody, TableCell,
  TableContainer, TableRow, Paper,
  LinearProgress, Modal
} from '@material-ui/core'

import Cell from './Cell'
import SudokuModal from './SudokuModal'

// Hook
const shiftNumberKeys = [
  '!', '@', '#', '$', '%', '^', '&', '*', '('
];
const otherKeys = [
  'Backspace'
]

function useKeyPress() {
  let listening_keys = ['1', '2', '3', '4', '5',
    '6', '7', '8', '9'] + shiftNumberKeys + otherKeys

  // State for keeping track of whether key is pressed
  const [numKeyPressed, setNumKeyPressed] = useState('');

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (listening_keys.includes(key)) {
      setNumKeyPressed(key);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (listening_keys.includes(key)) {
      setNumKeyPressed(null);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return numKeyPressed;
}
export default function Sudoku(props) {

  const initGame1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const initGame3 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 9],
    [2, 0, 0, 0, 0, 0, 0, 8, 0],
    [6, 0, 0, 9, 4, 8, 5, 0, 0],
    [0, 0, 1, 0, 0, 6, 3, 4, 5],
    [0, 0, 0, 0, 9, 0, 0, 0, 0],
    [3, 7, 4, 5, 0, 0, 9, 0, 0],
    [0, 0, 8, 6, 1, 2, 0, 0, 3],
    [0, 2, 0, 0, 0, 0, 0, 0, 6],
    [9, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const initGame = [
    [0, 4, 5, 1, 8, 6, 7, 2, 9],
    [9, 8, 1, 3, 7, 2, 4, 6, 5],
    [2, 6, 7, 9, 5, 4, 1, 8, 3],
    [8, 7, 6, 2, 3, 9, 5, 1, 4],
    [1, 5, 2, 7, 4, 8, 9, 3, 6],
    [4, 9, 3, 6, 1, 5, 2, 7, 8],
    [5, 2, 4, 8, 6, 7, 3, 9, 1],
    [6, 1, 9, 4, 2, 3, 8, 5, 7],
    [7, 3, 8, 5, 9, 1, 6, 4, 2]
  ];

  const [game, setGame] = useState(initGame);


  const [tentativeValues, setTentativeValues] = useState(new Map())

  const [selected, setSelected] = useState([-1, -1])


  const selectCell = ([x, y]) => {
    setSelected([x, y])
  }

  // const transpose = ([x, y]) => {
  //   return [
  //           Math.floor(x / 3) * 3 + Math.floor(y / 3),
  //           y % 3 + x % 3 * 3
  //         ]
  // }

  const getStatistic = (g) => {
    let ret = new Map()
    g.forEach(x => {
      x.forEach(y => {
        ret[y] = ret[y] + 1 || 1
      })
    })
    delete ret[0]
    return ret
  }

  const [statistic, setStatistic] = useState(() => getStatistic(game));
  const [conflicts, setConflicts] = useState(() => new Set());
  const [gameComplete, setGameComplete] = useState(false);

  const isPeer = ([x, y], [a, b]) => {
    if (x == a && y == b) {
      return false
    }
    return x == a ||
      y == b ||
      Math.floor(x / 3) == Math.floor(a / 3) &&
      Math.floor(y / 3) == Math.floor(b / 3)
  }

  const checkConflict = (g) => {
    let ret = new Set()
    g.forEach((x, idx) => {
      x.forEach((y, idy) => {
        if (hasConflict([idx, idy], g)) {
          ret.add(idx * 10 + idy)
        }
      })
    })
    return ret
  }

  const hasConflict = ([x, y], g) => {
    const v = g[x][y]
    if (v == 0) {
      return false
    }
    for (let i = 0; i < 9; i++) {
      if (i == y) {
        continue
      }
      if (v == g[x][i]) {
        return true
      }
    }
    for (let i = 0; i < 9; i++) {
      if (i == x) {
        continue
      }
      if (v == g[i][y]) {
        return true
      }
    }
    for (let i = 0; i < 3; i++) {
      let ii = Math.floor(x / 3) * 3 + i
      for (let j = 0; j < 3; j++) {
        let jj = Math.floor(y / 3) * 3 + j
        if (ii == x && jj == y) {
          continue
        }
        if (v == g[ii][jj]) {
          return true
        }
      }
    }
    return false
  }

  const isConflict = ([x, y]) => {
    return conflicts.has(x * 10 + y)
  }

  const isFixed = ([x, y]) => {
    return initGame[x][y] > 0
  }

  const numberKeyPressed = useKeyPress();

  const getNewGame = game.map((el, idx) => {
    if (idx === selected[0]) {
      return el.map((item, index) => {
        if (index === selected[1] && !isFixed(selected)) {

          // console.log(el, idx, selected)
          return parseInt(numberKeyPressed) || 0
        }
        return item
      })
    } else {
      return el
    }
  })

  const getTentativeValues = (action) => {
    let ret = { ...tentativeValues };
    let num = shiftNumberKeys.indexOf(numberKeyPressed) + 1
    if (selected[0] > 0 && selected[1] > 0 && !isFixed(selected)) {
      if (action === 'update') {
        if (ret[selected]) {
          if (ret[selected].has(num)) {
            ret[selected].delete(num)
          } else {
            ret[selected].add(num)
          }
        } else {
          ret[selected] = new Set([num])
        }
      } else if (action === 'clear') {
        delete ret[selected]
      }
    }
    return ret
  }

  const isGameComplete = (g, c) => {
    let unfill = g.find(r => {
      r.find(cell => {
        cell === 0
      })
    })
    if (unfill === 0) {
      return false
    }
    if (c.size > 0) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (numberKeyPressed) {
      if (shiftNumberKeys.includes(numberKeyPressed)) {
        setTentativeValues(getTentativeValues('update'))
      } else {
        setTentativeValues(getTentativeValues('clear'))
        setGame(getNewGame)
        setStatistic(getStatistic(getNewGame))
        setConflicts(checkConflict(getNewGame))
        setGameComplete(isGameComplete(getNewGame, checkConflict(getNewGame)))
      }
    }

  }, [numberKeyPressed])

  useEffect(() => {
  }, [selected])

  const getValue = ([x, y]) => {
    if (tentativeValues[[x, y]]) {
      return tentativeValues[[x, y]]
    }
    return game[x][y]
  }

  return (
    <div>
      <Box display='flex' justifyContent='space-around'>
        <div width='100%' style={{ height: 600 }}>
          <Box style={{ width: 500, height: 450 }} display='flex'
            flexDirection='column' border={0} borderColor='text.disabled'>
            {[...Array(9).keys()].map(x => {
              return <Box key={'row' + x}
                display='flex' flexDirection='row'
                width='100%' height='100%'
                justifyContent='center'>
                {[...Array(9).keys()].map(y => {
                  return <Cell className='column'
                    key={y}
                    x={x}
                    y={y}
                    value={getValue([x, y])}
                    onClick={() => { selectCell([x, y]); }}
                    selected={x === selected[0] && y === selected[1]}
                    isFixed={isFixed([x, y])}
                    isPeer={isPeer([x, y], selected)}
                    isTentative={[x, y] in tentativeValues}
                    isConflict={isConflict([x, y])}
                  />
                })}
              </Box>
            })}
          </Box>
        </div>

        <div>
          <TableContainer component={Paper}>
            <Table aria-label="custom table">
              <TableBody>
                {[...Array(9).keys()].map((row) => {
                  row += 1
                  return <TableRow key={row}>
                    <TableCell component="th" scope="row">
                      {row}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      <LinearProgress variant="determinate" value={Math.min(statistic[row] / 9 * 100, 100)} />

                    </TableCell>
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
      <div>
        <SudokuModal
          open={gameComplete}
          onClose={() => setGameComplete(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        />

      </div>
    </div>
  );


}