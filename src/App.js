import React, {useState} from 'react';
import Playground from './Playground'
import Menu from './Menu'
import './App.css';

function App() {
  const sizes = [
    {
      label: 'Beginner 9x9',
      value: 9
    },
    {
      label: 'Advance 16x16',
      value: 16
    }
  ]
  const [size, setSize] = useState(null)

  return (
    <div className="App">
      <header className="App-header">
        Minesweeper
      </header>

      <Playground size={size}/>
      <Menu sizes={sizes} size={size} setSize={setSize}/>
    </div>
  );
}

export default App;
