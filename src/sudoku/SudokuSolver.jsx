export const checkGrid = (game) => {
  for (let x = 0; x < game.length; x++) {
    let row = game[x]
    for (let y = 0; y < row.length; y++) {
      if (row[y] == 0) {
        return false;
      }
    }
  }
  return true;
}

export const solve = (game) => {
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
          console.log("returning ")
          console.log(game)
          return true
        } else {
          if (solve(game)) {
            return true
          }
        }
      }
      break
    }
  }
  game[idx][idy] = 0
}