import React, {useState, useEffect} from 'react'
import {
  withMinesData,
  makeGameData,
  revealAllMines,
  isRevealedAllHints,
  spreadEmptySurroundButtons,
  hhmmss
} from '../utils'
import './Playground.css'
import Button from '../Button/Button'
import EndGameModal from '../EndGameModal/EndGameModal'

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

  const loseGame = (boomButton) => {
    let newData = revealAllMines(data)
    newData[boomButton.x][boomButton.y].boom = true
    setStatus('lose')
    setData(newData)
  }

  const winGame = () => {
    setStatus('win')
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
      loseGame(button)
      return
    }

    // not mine
    newData[button.x][button.y].clicked = true
    setData(newData)

    // is win
    if (isRevealedAllHints(newData)) {
      winGame()
      return
    }

    // spread empty surround buttons until reach barrier
    if (button.hint === 0) {
      newData = spreadEmptySurroundButtons(button, newData)
      setData(newData)

      if (isRevealedAllHints(newData)) {
        winGame()
      }
    }
  }

  const getEndGameTitle = () => {
    let title
    switch (status) {
      case 'win':
        title = 'Won in'
        break
      case 'lose':
      default:
        title = 'Lost in'
        break
    }

    return `${title} ${hhmmss(elapsedTime)}`
  }

  return (
    <div className="playground" style={{
      width: 30 * props.size
    }}
      data-testid="playground"
    >
      <header className="playground-header">
        <button className={'status ' + status} onClick={resetGame}/>
        <span className="elapsed-time">
          <span role="img" aria-label="img">&#9200; </span>{hhmmss(elapsedTime, 3)}
        </span>
      </header>
      {data.map((row, rowIndex) =>
        <div key={rowIndex} className="row">
          {row.map(button =>
            <Button key={`${button.x}${button.y}`} {...button}
              clickButton={clickButton.bind(this, button)}
              data-testid="button"
            />
          )}
        </div>
      )}
      <EndGameModal
        isWinOrLose={status === 'win' || status === 'lose'}
        title={getEndGameTitle()}
        resetGame={resetGame}
        changeLevel={() => props.setSize(null)}
      >
      </EndGameModal>
    </div>
  )
}

export default withMinesData(Playground)
