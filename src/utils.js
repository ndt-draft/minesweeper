import React, {useState, useEffect, useCallback} from 'react'
import _ from 'lodash'

export const withMinesData = (Component) => {
  return (props) => {
    const [mines, setMines] = useState([])

    const fetchMines = useCallback(async () => {
      try {
        let minesResponse = await fetchMinesData(props.size)
        setMines(minesResponse.data)
      } catch (e) {
        // error fetching mines data
      }
    }, [props.size])

    useEffect(() => {
      fetchMines()
    }, [fetchMines])

    return mines.length === 0 ?
      <div>Loading...</div> :
      <Component size={props.size} mines={mines} fetchMines={fetchMines}/>
  }
}

export const fetchMinesData = (size) => {
  let url

  switch (size) {
    case 16:
      url = 'https://tiki-minesweeper.herokuapp.com/getMines?size=16&mines=40'
      break
    case 9:
    default:
      url = 'https://tiki-minesweeper.herokuapp.com/getMines?size=9&mines=10'
      break
  }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const makeGameData = (size, mines) => {
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

export const revealAllMines = (data) => {
  return _.chunk(
    _.flatten(data).map(button => button.mine ? {...button, clicked: true} : button),
    data.length
  )
}

export const isRevealedAllHints = (data) => {
  return !_.flatten(data).some(button => !button.mine && !button.clicked)
}
