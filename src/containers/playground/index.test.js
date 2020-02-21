import React from 'react';
import {createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import { render, fireEvent, wait } from '@testing-library/react';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Playground from './index';
import createRootReducer from '../../reducers'
import gameReducer, {fetchMines, SET_GAME_DATA, initialState} from '../../reducers/game'
import {makeGameData} from '../../utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

function renderWithRedux(
  ui,
  {
    initData,
    store = createStore(
      createRootReducer(),
      initData,
      applyMiddleware(thunk)
    )
  } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

test('renders loading playground', () => {
  const store = mockStore({
    game: {
      ...initialState,
      size: 9
    }
  })
  const { getByText } = render(<Playground store={store}/>);
  const playgroundElement = getByText(/Loading/i)
  expect(playgroundElement).toHaveClass('loading')
  expect(playgroundElement.innerHTML).toEqual('Loading...')
});

describe('renders playground api test', () => {
  // Group API tests so we can clear the mock more easily
  afterEach(() => global.fetch.mockClear());

  test('should load 9x9 playground', () => {
    const store = mockStore({
      game: initialState
    })
    const size = 9

    // Mock API
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          data: [
            {x: 0, y: 0}
          ]
        })
      }))

    const expectedAction = {
      type: SET_GAME_DATA,
      payload: {
        mines: [{x: 0, y: 0}],
        loading: false,
        data: makeGameData(size, [{x: 0, y: 0}])
      }
    }

    return store.dispatch(fetchMines(size)).then(async () => {
      expect(store.getActions()[1]).toEqual(expectedAction)
      expect(gameReducer(initialState, store.getActions()[1])).toEqual({
        ...initialState,
        mines: [{x: 0, y: 0}],
        loading: false,
        data: makeGameData(size, [{x: 0, y: 0}])
      })

      expect(global.fetch.mock.calls[0][0]).toBe('https://tiki-minesweeper.herokuapp.com/getMines?size=9&mines=10')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  test('should load 16x16 playground', () => {
    const store = mockStore({
      game: initialState
    })
    const size = 16

    // Mock API
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          data: [
            {x: 0, y: 0}
          ]
        })
      }))

    const expectedAction = {
      type: SET_GAME_DATA,
      payload: {
        mines: [{x: 0, y: 0}],
        loading: false,
        data: makeGameData(size, [{x: 0, y: 0}])
      }
    }

    return store.dispatch(fetchMines(size)).then(async () => {
      expect(store.getActions()[1]).toEqual(expectedAction)
      expect(gameReducer(initialState, store.getActions()[1])).toEqual({
        ...initialState,
        mines: [{x: 0, y: 0}],
        loading: false,
        data: makeGameData(size, [{x: 0, y: 0}])
      })

      expect(global.fetch.mock.calls[0][0]).toBe('https://tiki-minesweeper.herokuapp.com/getMines?size=16&mines=40')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })

  test('should lose when click mine', async () => {
      // Mock API
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          data: [
            {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}
          ]
        })
      }))

    const {getByTestId, getAllByTestId} = renderWithRedux(<Playground />, {
      initData: {
        game: {
          ...initialState,
          size: 9,
        }
      }
    })

    await wait()

    const playgroundElement = getByTestId('playground')
    const statusElement = playgroundElement.querySelector('.status')
    const buttons = getAllByTestId('button')

    fireEvent.click(buttons[0])

    expect(statusElement).toHaveClass('lose')
    expect(statusElement).not.toHaveClass('win playing')
    expect(buttons[0]).toHaveClass('clicked bomb boom')
    expect(buttons[1]).toHaveClass('clicked bomb')
    expect(buttons[2]).toHaveClass('clicked bomb')
  })

  test('should win if reveal all hints', async () => {
    // Mock API
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          data: [
            {x: 0, y: 0}
          ]
        })
      }))

    const {getByTestId, getAllByTestId} = renderWithRedux(<Playground />, {
      initData: {
        game: {
          ...initialState,
          size: 9,
        }
      }
    })

    await wait()

    const playgroundElement = getByTestId('playground')
    const statusElement = playgroundElement.querySelector('.status')
    const buttons = getAllByTestId('button')

    fireEvent.click(buttons[3])
    expect(statusElement).toHaveClass('win')
    expect(statusElement).not.toHaveClass('lose playing')
  })
})
