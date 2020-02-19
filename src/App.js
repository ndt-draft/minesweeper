import React, {useState} from 'react';
import Playground from './Playground/Playground'
import Menu from './Menu/Menu'
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
        <h2 className="App-name">Minesweeper</h2>
      </header>

      {size && <Playground size={size} setSize={setSize}/>}
      <Menu sizes={sizes} size={size} setSize={setSize}/>

      <footer className="App-footer">Made by <a href="https://github.com/thanh4890">thanh4890</a> with &hearts; </footer>
    </div>
  );
}

export default App;
