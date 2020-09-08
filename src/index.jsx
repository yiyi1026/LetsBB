import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'

import Root from './Root'
import Sudoku from './sudoku/Sudoku'

ReactDOM.render(

  <BrowserRouter>
    <Route
      exact
      path="/sudoku"
      render={() => <Sudoku />}
    />
    <Route
      exact
      path="/"
      render={() => (
        <Root />
      )}
    />
  </BrowserRouter>,

  document.getElementById('root'))
