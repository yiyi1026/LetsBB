import React from "react"
import ReactDOM from "react-dom"

import Root from "./Root"
import Sudoku from './sudoku/Sudoku'

import { BrowserRouter, Route} from 'react-router-dom'


ReactDOM.render(

    <BrowserRouter>
        <Route
            exact
            path="/"
            render={(props) => (
                <Root />
            )}
        />
        <Route
            exact
            path="/sudoku"
            render={(props) => <Sudoku />}
        />
    </BrowserRouter>



    , document.getElementById("root"))
