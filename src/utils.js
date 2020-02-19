import React, {useState, useEffect, useCallback} from 'react'
import _ from 'lodash'

export const withMinesData = (Component) => {
  return (props) => {
    const [mines, setMines] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMines = useCallback(async () => {
      setLoading(true)

      try {
        let minesResponse = await fetchMinesData(props.size)
        setMines(minesResponse.data)
      } catch (e) {
        // error fetching mines data
      }

      setLoading(false)
    }, [props.size])

    useEffect(() => {
      fetchMines()
    }, [fetchMines])

    if (props.size === null) {
      return <div/>
    }

    return loading ?
      <div className="loading">Loading...</div> :
      <Component {...props} mines={mines} fetchMines={fetchMines}/>
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

export const spreadEmptySurroundButtons = (button, data) => {
  return recursiveSpreadEmptyButtons([button], data)
}

const recursiveSpreadEmptyButtons = (emptyButtons, data) => {
  if (emptyButtons.length === 0) {
    return data
  }

  let surroundButtons = [
    // previous row
    {
      x: emptyButtons[0].x - 1,
      y: emptyButtons[0].y - 1
    },
    {
      x: emptyButtons[0].x - 1,
      y: emptyButtons[0].y
    },
    {
      x: emptyButtons[0].x - 1,
      y: emptyButtons[0].y + 1
    },
    // same row
    {
      x: emptyButtons[0].x,
      y: emptyButtons[0].y - 1
    },
    {
      x: emptyButtons[0].x,
      y: emptyButtons[0].y + 1
    },
    // next row
    {
      x: emptyButtons[0].x + 1,
      y: emptyButtons[0].y - 1
    },
    {
      x: emptyButtons[0].x + 1,
      y: emptyButtons[0].y
    },
    {
      x: emptyButtons[0].x + 1,
      y: emptyButtons[0].y + 1
    },
  ]

  surroundButtons.forEach(surroundButton => {
    if (
      data[surroundButton.x] &&
      data[surroundButton.x][surroundButton.y] &&
      data[surroundButton.x][surroundButton.y].clicked !== true &&
      (
        data[surroundButton.x][surroundButton.y].hint === 0 ||
        data[surroundButton.x][surroundButton.y].mine !== true
      )
    ) {
      // click empty or barrier
      data[surroundButton.x][surroundButton.y].clicked = true

      // push only empty button
      if (data[surroundButton.x][surroundButton.y].hint === 0) {
        emptyButtons.push(data[surroundButton.x][surroundButton.y])
      }
    }
  })

  emptyButtons.shift()

  return recursiveSpreadEmptyButtons(emptyButtons, data)
}

// @see https://stackoverflow.com/a/2998822
export function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function hhmmss(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs%60;
  var hours = Math.floor(minutes/60)
  minutes = minutes%60;
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}`;
}
