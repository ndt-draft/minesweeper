import React, {useState} from 'react'
import _ from 'lodash'
import Button from './Button'

const makeGameData = () => {
  const mines = [{"x":4,"y":4},{"x":5,"y":1},{"x":4,"y":5},{"x":0,"y":0},{"x":6,"y":0},{"x":5,"y":2},{"x":8,"y":5},{"x":3,"y":1},{"x":2,"y":4},{"x":0,"y":8}]

  const size = 9 // change to lower number to test win faster

  const buttons = new Array(size).fill().map((a, x) => {
    return new Array(size).fill({mine: false, hint: 0, clicked: false}).map((b, y) => {
      let isMine = mines.some(mine => mine.x === x && mine.y === y)
      return {
        ...b,
        x,
        y,
        mine: isMine
      }
    })
  })

  // make hint
  mines.forEach(mine => {
    let surroundButtons = [
      // previous row
      {
        x: mine.x - 1,
        y: mine.y - 1
      },
      {
        x: mine.x - 1,
        y: mine.y
      },
      {
        x: mine.x - 1,
        y: mine.y + 1
      },
      // same row
      {
        x: mine.x,
        y: mine.y - 1
      },
      {
        x: mine.x,
        y: mine.y + 1
      },
      // next row
      {
        x: mine.x + 1,
        y: mine.y - 1
      },
      {
        x: mine.x + 1,
        y: mine.y
      },
      {
        x: mine.x + 1,
        y: mine.y + 1
      },
    ]

    surroundButtons.forEach(surroundButton => {
      if (buttons[surroundButton.x] && buttons[surroundButton.x][surroundButton.y]) {
        buttons[surroundButton.x][surroundButton.y].hint += 1
      }
    })
  })

  console.log(buttons)

  return buttons
}

const revealAllMines = (data) => {
  return _.chunk(
    _.flatten(data).map(button => button.mine ? {...button, clicked: true} : button),
    data.length
  )
}

const isRevealedAllHints = (data) => {
  return !_.flatten(data).some(button => !button.mine && !button.clicked)
}

const Playground = () => {
  const [status, setStatus] = useState('playing') // playing/win/lose
  const [data, setData] = useState(makeGameData())

  const resetGame = () => {
    setStatus('playing')
    setData(makeGameData())
  }

  const endGame = () => {
    setData(revealAllMines(data))
  }

  const clickButton = (button) => {
    // skip if already clicked
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
      {data.map(row =>
        <div className="row">
          {row.map(button =>
            <Button {...button}
              clickButton={clickButton.bind(this, button)} />
          )}
        </div>
      )}
    </div>
  )
}

export default Playground
