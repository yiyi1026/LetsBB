import { checkGrid, solve } from './SudokuSolver'

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let counter = 0

export const countSolution = (game) => {
  let idx,idy
  for (let i = 0; i < 81; i++) {
    idx = Math.floor(i / 9)
    idy = i % 9
    let row = game[idx]
    if (game[idx][idy] == 0) {
      let validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        .filter(a => !row.includes(a))
        .filter(a =>
          ![game[0][idy], game[1][idy], game[2][idy],
          game[3][idy], game[4][idy], game[5][idy],
          game[6][idy], game[7][idy], game[8][idy]].includes(a)
        )
        .filter(a => {
          let m = Math.floor(idx / 3) * 3
          let n = Math.floor(idy / 3) * 3
          return ![game[m][n], game[m][n + 1], game[m][n + 2],
          game[m + 1][n], game[m + 1][n + 1], game[m + 1][n + 2],
          game[m + 2][n], game[m + 2][n + 1], game[m + 2][n + 2]].includes(a)
        })
      for (let v = 0; v < validNumbers.length; v++) {
        let valid = validNumbers[v]
        game[idx][idy] = valid
        if (checkGrid(game)) {
          counter++
          break
        } else {
          if (countSolution(game)) {
            return true
          }
        }
      }
      break
    }
  }
  game[idx][idy] = 0
}

const fillGrid = () => {
  let game = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]

  let numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // Find next empty cell
  for (let i = 0; i < 81; i++) {
    let idx = Math.floor(i / 9)
    let idy = i % 9
    let row = game[idx]
    if (game[idx][idy] == 0) {
      shuffle(numberList)
      numberList.filter(a => !row.includes(a))
        .filter(a =>
          ![game[0][idy], game[1][idy], game[2][idy],
          game[3][idy], game[4][idy], game[5][idy],
          game[6][idy], game[7][idy], game[8][idy]].includes(a)
        )
        .filter(a => {
          let m = Math.floor(idx / 3) * 3
          let n = Math.floor(idy / 3) * 3
          return ![game[m][n], game[m][n + 1], game[m][n + 2],
          game[m + 1][n], game[m + 1][n + 1], game[m + 1][n + 2],
          game[m + 2][n], game[m + 2][n + 1], game[m + 2][n + 2]].includes(a)
        })
      for (let v = 0; v < numberList.length; v++) {
        let valid = numberList[v]
        game[idx][idy] = valid
        if (checkGrid(game)) {
          console.log("returning ")
          console.log(game)
          return game
        } else {
          if (solve(game)) {
            return game
          }
        }
      }
      break
    }
  }
  grid[idx][idy] = 0
}

export const generate = () => {
  let game = fillGrid()
  let attempts = 15
  for (; attempts > 0; ) {
    // Select a random cell that is not already empty
    let row = Math.floor(Math.random() * 9)
    let col = Math.floor(Math.random() * 9)

    while (game[row][col] == 0) {
      row = Math.floor(Math.random() * 9)
      col = Math.floor(Math.random() * 9)
    }
    // Remember its cell value in case we need to put it back  
    let backup = game[row][col]
    game[row][col] = 0

    // Take a full copy of the grid
    let copyGame = JSON.parse(JSON.stringify(game))

    // Count the number of solutions that this grid has 
    // (using a backtracking approach implemented in the solveGrid() function)
    counter = 0
    countSolution(copyGame)
    // If the number of solution is different from 1 then 
    // we need to cancel the change by putting the value we took away back in the grid
    if (counter != 1) {
      game[row][col] = backup
      // We could stop here, but we can also have another 
      // attempt with a different cell just to try to remove more numbers
      attempts -= 1
    }
  }

  console.log(game)
  return game
}