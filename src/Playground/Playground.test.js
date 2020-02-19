import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Playground from './Playground';

test('renders loading playground', () => {
  const { getByText } = render(<Playground size={9}/>);
  const playgroundElement = getByText(/Loading/i)
  expect(playgroundElement).toHaveClass('loading')
  expect(playgroundElement.innerHTML).toEqual('Loading...')
});

describe('renders playground api test', () => {
  // Group API tests so we can clear the mock more easily
  afterEach(() => global.fetch.mockClear());

  test('should load 9x9 playground', async () => {
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

    const setSize = jest.fn()
    const {getByTestId, getAllByTestId} = render(<Playground size={9} setSize={setSize}/>)

    await wait()

    const playgroundElement = getByTestId('playground')

    expect(global.fetch.mock.calls[0][0]).toBe('https://tiki-minesweeper.herokuapp.com/getMines?size=9&mines=10')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const buttons = getAllByTestId('button')
    expect(buttons.length).toBe(9 * 9)
  })

  test('should load 16x16 playground', async () => {
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

    const setSize = jest.fn()
    const {getByTestId, getAllByTestId} = render(<Playground size={16} setSize={setSize}/>)

    await wait()

    const playgroundElement = getByTestId('playground')

    expect(global.fetch.mock.calls[0][0]).toBe('https://tiki-minesweeper.herokuapp.com/getMines?size=16&mines=40')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    const buttons = getAllByTestId('button')
    expect(buttons.length).toBe(16 * 16)
  })

  test('should lose when click mine', async () => {
    // Mock API
    jest.spyOn(global, 'fetch')
      .mockImplementationOnce(() => Promise.resolve({
        status: 200,
        json: () => Promise.resolve({
          data: [
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 2}
          ]
        })
      }))

    const setSize = jest.fn()
    const {getByTestId, getAllByTestId} = render(<Playground size={9} setSize={setSize}/>)

    await wait()

    const playgroundElement = getByTestId('playground')
    const statusElement = playgroundElement.querySelector('.status')
    const buttons = getAllByTestId('button')

    fireEvent.click(buttons[0])
    expect(statusElement).toHaveClass('lose')
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

    const setSize = jest.fn()
    const {getByTestId, getAllByTestId} = render(<Playground size={9} setSize={setSize}/>)

    await wait()

    const playgroundElement = getByTestId('playground')
    const statusElement = playgroundElement.querySelector('.status')
    const buttons = getAllByTestId('button')

    fireEvent.click(buttons[3])
    expect(statusElement).toHaveClass('win')
  })
})
