import _ from 'lodash'

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

export const findSurroundButtons = (button) => {
  return [
    // previous row
    {
      x: button.x - 1,
      y: button.y - 1
    },
    {
      x: button.x - 1,
      y: button.y
    },
    {
      x: button.x - 1,
      y: button.y + 1
    },
    // same row
    {
      x: button.x,
      y: button.y - 1
    },
    {
      x: button.x,
      y: button.y + 1
    },
    // next row
    {
      x: button.x + 1,
      y: button.y - 1
    },
    {
      x: button.x + 1,
      y: button.y
    },
    {
      x: button.x + 1,
      y: button.y + 1
    },
  ]
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
    let surroundButtons = findSurroundButtons(mine)

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

  let surroundButtons = findSurroundButtons(emptyButtons[0])

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
