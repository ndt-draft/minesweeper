import {
  fetchMinesData,
  makeGameData,
  isRevealedAllHints,
  revealAllMines,
  spreadEmptySurroundButtons
} from '../utils'

// Constants
export const SET_GAME_DATA = 'game/SET_GAME_DATA'
export const SET_SIZE = 'game/SET_SIZE'

// Actions
export const setGameData = payload => ({
  type: SET_GAME_DATA,
  payload
})

export const setSize = size => ({
  type: SET_SIZE,
  size
})

// Thunks
export const fetchMines = size => {
  return async (dispatch, getState) => {
    dispatch(setGameData({loading: true}))

    try {
      let minesResponse = await fetchMinesData(size)
      let mines = minesResponse.data

      dispatch(setGameData({
        mines,
        loading: false,
        data: makeGameData(size, mines)
      }))
    } catch (e) {
      // error fetching mines data
      dispatch(setGameData({loading: false}))
    }
  }
}

export const setElapsedTime = elapsedTime => {
  return dispatch => {
    dispatch(setGameData({
      elapsedTime
    }))
  }
}

export const resetGame = () => {
  return async (dispatch, getState) => {
    const {size} = getState().game

    // fetch new mines data
    await dispatch(fetchMines(size))

    dispatch(setGameData({
      elapsedTime: 0,
      status: 'playing'
    }))
  }
}

const loseGame = (boomButton) => {
  return (dispatch, getState) => {
    const {data} = getState().game
    let newData = revealAllMines(data)
    newData[boomButton.x][boomButton.y].boom = true

    dispatch(setGameData({
      status: 'lose',
      data: newData
    }))
  }
}

const winGame = () => {
  return dispatch => {
    dispatch(setGameData({
      status: 'win'
    }))
  }
}

export const changeLevel = () => {
  return dispatch => {
    dispatch(setGameData(initialState))
  }
}

export const clickButton = (button) => {
  return (dispatch, getState) => {
    const {status, data, elapsedTime} = getState().game

    // skip if already clicked or lose
    if (button.clicked || status !== 'playing') {
      return
    }

    // start time
    if (elapsedTime === 0) {
      dispatch(setElapsedTime(1))
    }

    let newData = [...data]

    // click on mine
    if (button.mine) {
      dispatch(loseGame(button))
      return
    }

    // not mine
    newData[button.x][button.y].clicked = true
    dispatch(setGameData({
      data: newData
    }))

    // is win
    if (isRevealedAllHints(newData)) {
      dispatch(winGame())
      return
    }

    // spread empty surround buttons until reach barrier
    if (button.hint === 0) {
      newData = spreadEmptySurroundButtons(button, newData)
      dispatch(setGameData({data: newData}))

      if (isRevealedAllHints(newData)) {
        dispatch(winGame())
      }
    }
  }
}

// Action handlers
const ACTION_HANDLERS = {
  [SET_GAME_DATA]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  },
  [SET_SIZE]: (state, action) => {
    return {
      ...state,
      size: action.size
    }
  }
}

// Reducer
export const initialState = {
  sizes: [
    {
      label: 'Beginner 9x9',
      value: 9
    },
    {
      label: 'Advance 16x16',
      value: 16
    }
  ],
  size: null,
  loading: true,
  mines: [],
  data: [],
  status: 'playing',
  elapsedTime: 0
}

export default (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
