import React, {useState, useEffect} from 'react'
import {
  withMinesData,
  makeGameData,
  revealAllMines,
  isRevealedAllHints,
  spreadEmptySurroundButtons,
  pad
} from './utils'
import './Playground.css'
import Button from './Button'

const Playground = props => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [status, setStatus] = useState('playing') // playing/win/lose
  const [data, setData] = useState(makeGameData(props.size, props.mines))

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (elapsedTime === 0) return
      setElapsedTime(elapsedTime + 1)
    }, 1000)

    if (status !== 'playing') {
      clearTimeout(timeout)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [elapsedTime, status])

  const resetGame = () => {
    // fetch new mines data
    props.fetchMines(props.size)
    setStatus('playing')
    // reset game data
    setData(makeGameData(props.size, props.mines))
  }

  const endGame = () => {
    setData(revealAllMines(data))
  }

  const clickButton = (button) => {
    // skip if already clicked or lose
    if (button.clicked || status !== 'playing') {
      return
    }

    // start time
    if (elapsedTime === 0) {
      setElapsedTime(1)
    }

    let newData = [...data]

    // click on mine
    if (button.mine) {
      setStatus('lose')
      endGame()
      return
    }

    // not mine
    newData[button.x][button.y].clicked = true
    setData(newData)

    // is win
    if (isRevealedAllHints(newData)) {
      setStatus('win')
      return
    }

    // spread empty surround buttons until reach barrier
    if (button.hint === 0) {
      newData = spreadEmptySurroundButtons(button, newData)
      setData(newData)

      if (isRevealedAllHints(newData)) {
        setStatus('win')
      }
    }
  }

  return (
    <div className="playground" style={{
      width: 30 * props.size
    }}>
      <header>
        <button className={'status ' + status} onClick={resetGame}/>
        <span className="elapsed-time">
          {pad(elapsedTime, 3)}
        </span>
      </header>
      {data.map((row, rowIndex) =>
        <div key={rowIndex} className="row">
          {row.map(button =>
            <Button key={`${button.x}${button.y}`} {...button}
              clickButton={clickButton.bind(this, button)} />
          )}
        </div>
      )}
    </div>
  )
}

export default withMinesData(Playground)
