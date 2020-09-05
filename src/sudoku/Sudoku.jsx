import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'

import Cell from './Cell'
// Hook
const shiftNumberKeys = [
  '!', '@', '#', '$', '%', '^', '&', '*', '('
];

function useKeyPress() {
  let listening_keys = ['1', '2', '3', '4', '5',
    '6', '7', '8', '9'] + shiftNumberKeys
  
  // State for keeping track of whether key is pressed
  const [numKeyPressed, setNumKeyPressed] = useState('');

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (listening_keys.includes(key)) {
      // setNumKeyPressed(key);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (listening_keys.includes(key)) {
      setNumKeyPressed(key);
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

  const initGame = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 0, 2, 2, 2, 2, 2, 2],
    [3, 0, 3, 3, 3, 3, 3, 3, 3],
    [4, 4, 4, 4, 4, 0, 4, 4, 4],
    [5, 0, 5, 5, 0, 5, 5, 5, 5],
    [6, 6, 6, 6, 6, 6, 6, 6, 6],
    [7, 7, 7, 7, 7, 7, 7, 7, 7],
    [8, 0, 8, 8, 0, 8, 8, 8, 8],
    [9, 9, 9, 9, 9, 9, 9, 9, 9]
  ];

  const [game, setGame] = useState(initGame);

  const [tentativeValues, setTentativeValues] = useState({})

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

  const isPeer = ([x,y]) => {
    return x == selected[0] || 
          y == selected[1] ||
          Math.floor(x/3) == Math.floor(selected[0] /3) &&
          Math.floor(y/3) == Math.floor(selected[1] /3)
  }

  const isFixed = ([x,y]) => {
    return initGame[x][y] > 0 
  }

  const numberKeyPressed = useKeyPress();
  

  const getNewGame = game.map((el, idx) => {
    if (idx === selected[0]) {
      return el.map((item, index) => {
        if (index === selected[1] && !isFixed(selected)){
          return numberKeyPressed
        }
        return item
      })
    } else {
      return el
    }
  })

  const getTentativeValues =  (action) => {
    console.log(tentativeValues)
    let ret = { ...tentativeValues };
    let num = shiftNumberKeys.indexOf(numberKeyPressed) + 1
    if(selected[0] > 0 && selected[1] > 0 && !isFixed(selected)){
      if(action === 'update'){
        if(ret[selected]){
          if(ret[selected].has(num)){
            ret[selected].delete(num)
          } else{
            ret[selected].add(num)
          }
        } else{
          ret[selected] = new Set([num])
        }
      } else if ( action === 'clear' ){
        delete ret[selected]
      }
    }
    return ret
  }

  useEffect(() => {
    console.log(numberKeyPressed, selected)

    if(shiftNumberKeys.includes(numberKeyPressed)){
      setTentativeValues(getTentativeValues('update'))
    } else {
      setTentativeValues(getTentativeValues('clear'))
      setGame(getNewGame)
    }
  }, [numberKeyPressed])

  useEffect(() => {
  }, [selected])

  const getValue =([x, y]) => {
    if(tentativeValues[[x,y]]){
      return tentativeValues[[x,y]]
    }
    return game[x][y]
  }

  return (
    <div width='100%' style={{ height: 600 }}>
      <Box style={{ width: 500, height: 450 }} display='flex' 
            flexDirection='column' border={1} borderColor='text.disabled'>
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
                value={getValue([x,y])}
                onClick={() => { selectCell([x, y]); }}
                selected={x === selected[0] && y === selected[1]}
                isFixed={isFixed([x,y])}
                isPeer={isPeer([x,y]) }
                isTentative={[x,y] in tentativeValues}
              />
            })}
          </Box>
        })}
      </Box>
    </div>
  );


}