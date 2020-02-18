import React from 'react';
import Playground from './Playground'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Minesweeper
      </header>

      <Playground size={9}/>
    </div>
  );
}

export default App;
