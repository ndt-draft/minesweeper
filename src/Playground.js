import React, {useState} from 'react'
import {withMinesData, makeGameData, revealAllMines, isRevealedAllHints} from './utils'
import Button from './Button'

const Playground = props => {
  const [status, setStatus] = useState('playing') // playing/win/lose
  const [data, setData] = useState(makeGameData(props.size, props.mines))

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
    if (button.clicked || status === 'lose') {
      return
    }
    let newData = [...data]

    // click on mine
    if (button.mine) {
      setStatus('lose')
      endGame()
      return

    // not mine
    } else {
      newData[button.x][button.y].clicked = true
      setData(newData)

      // is win
      if (isRevealedAllHints(newData)) {
        setStatus('win')
        endGame()
        return
      }
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'lose':
        return 'Cry :('
      case 'win':
        return 'Win'
      case 'playing':
      default:
        return 'Smile'
    }
  }

  return (
    <div>
      <button onClick={resetGame}>
        {getStatusText()}
      </button>
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
