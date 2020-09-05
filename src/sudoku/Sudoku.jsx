import React, { useState, useEffect } from 'react'
import { Box } from '@material-ui/core'

import Cell from './Cell'
// Hook
const shiftNumberKeys = [
  "!", "@", "#", "$", "%", "^", "&", "*", "("
];

function useKeyPress() {
  let listening_keys = ['1', '2', '3', '4', '5',
    '6', '7', '8', '9'] + shiftNumberKeys
  
  // State for keeping track of whether key is pressed
  const [numKeyPressed, setNumKeyPressed] = useState("");

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

  const transpose = ([x, y]) => {
    return [
            Math.floor(x / 3) * 3 + Math.floor(y / 3),
            y % 3 + x % 3 * 3
          ]
  }

  const isPeer = ([x,y]) => {
    return x == selected[0] || 
          y == selected[1] ||
          Math.floor(x/3) == Math.floor(selected[0] /3) &&
          Math.floor(y/3) == Math.floor(selected[1] /3)
  }

  const isFixed = ([x,y]) => {
    [x,y] = transpose([x,y])
    return initGame[x][y] > 0 
  }

  const numberKeyPressed = useKeyPress();
  

  const getNewGame = game.map((el, idx) => {
    let transSelected = transpose(selected)
    
    if (idx === transSelected[0]) {
      return el.map((item, index) => {
        if (index === transSelected[1] && !isFixed(selected)){
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
    let transSelected = transpose(selected)
    if(transSelected[0] > 0 && transSelected[1] > 0){
      if(action === "update"){
        if(ret[transSelected]){
          if(ret[transSelected].has(num)){
            ret[transSelected].delete(num)
          } else{
            ret[transSelected].add(num)
          }
        } else{
          ret[transSelected] = new Set([num])
        }
      } else if ( action === "clear" ){
        delete ret[transSelected]
      }
    }
    return ret
  }

  useEffect(() => {
    console.log(numberKeyPressed, selected)

    if(shiftNumberKeys.includes(numberKeyPressed)){
      setTentativeValues(getTentativeValues("update"))
    } else {
      setTentativeValues(getTentativeValues("clear"))
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
    <div width="100%" style={{ height: 600 }}>
      <Box style={{ width: 500, height: 450 }} display="flex" 
            flexDirection="column" border={1} borderColor="text.disabled">
        {[...Array(9).keys()].map(x => {
          return <Box key={"row" + x} 
                      display="flex" flexDirection="row" 
                      width="100%" height="100%" 
                      justifyContent="center">
            {[...Array(9).keys()].map(y => {
              let [trans_x, trans_y] = transpose([x, y])
              return <Cell className="column"
                key={y}
                x={x}
                y={y}
                value={getValue([trans_x,trans_y])}
                onClick={() => { selectCell([x, y]); }}
                selected={x === selected[0] && y === selected[1]}
                isFixed={isFixed([x,y])}
                isPeer={isPeer([x,y]) }
                isTentative={[trans_x,trans_y] in tentativeValues}
              />
            })}
          </Box>
        })}
      </Box>


      {/* <Box style={{ width: 474, height: 474 }} border={1}
          display="flex" flexWrap="wrap">
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>

          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>

          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
          <Box border={1} style={{ width: 156, height: 156 }}
            display="flex" flexWrap="wrap">
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">1</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">2</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">3</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">4</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">5</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">6</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">7</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">8</Box>
            <Box border={1} width={50} display="flex" justifyContent="center" alignItems="center" borderColor="text.disabled">9</Box>
          </Box>
        </Box> */}
    </div>
  );


}