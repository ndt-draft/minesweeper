import React from 'react';
import { Provider } from 'react-redux'
import Game from './containers/game'

import './App.css'

function App(props) {
  return (
    <Provider store={props.store}>
      <div className="App">
        <header className="App-header">
          <h2 className="App-name">Minesweeper</h2>
        </header>

        <Game/>

        <footer className="App-footer">
          Made by <a href="https://github.com/thanh4890">thanh4890</a> with &hearts;
        </footer>
      </div>
    </Provider>
  );
}

export default App;
