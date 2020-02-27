import React from 'react'
import {createStore, applyMiddleware} from 'redux'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount } from 'enzyme'
import { act } from 'react-dom/test-utils';
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import createRootReducer from '../../reducers'

import Playground from './index'
import {
  fetchMines,
  SET_GAME_DATA,
  initialState,
  clickButton
} from '../../reducers/game'
import {makeGameData} from '../../utils'

Enzyme.configure({ adapter: new Adapter() });

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

test('shadow render', () => {
  const store = mockStore({
    game: {
      ...initialState,
      size: 9,
      loading: false
    }
  })
  const wrapper = shallow(<Playground store={store}/>)
  expect(wrapper.text()).toBe('<PlaygroundContainer />')
})

test('renders loading', () => {
  const store = mockStore({
    game: {
      ...initialState,
      size: 9,
      loading: true
    }
  })
  const wrapper = mount(<Playground store={store}/>)
  expect(wrapper.contains(<div className="loading">Loading...</div>)).toBe(true)
  expect(wrapper.find('.loading').text()).toBe('Loading...')
})

test('renders with 9x9 buttons', () => {
  const store = mockStore({
    game: {
      ...initialState,
      size: 9,
      loading: false,
      data: makeGameData(9, [{x: 0, y: 0}])
    }
  })

  const wrapper = mount(<Playground store={store}/>)
  const buttons = wrapper.find('Button')
  expect(buttons).toHaveLength(9 * 9)
  expect(buttons.at(0).props()).toMatchObject({
    x: 0,
    y: 0,
    mine: true
  })
})

describe('Test interaction', () => {
  // Group API tests so we can clear the mock more easily
  afterEach(() => global.fetch.mockClear());

  test('Should lose if click mine', async () => {
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

    const store = createStore(
      createRootReducer(),
      {
        game: {
          ...initialState,
          size: 9
        }
      },
      applyMiddleware(thunk)
    )

    const wrapper = mount(<Playground store={store}/>)

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise(resolve => setImmediate(resolve));
      wrapper.update();
    });

    expect(wrapper.find('Button').at(0).props()).toMatchObject({
      x: 0,
      y: 0,
      mine: true
    })

    await act(async () => {
      await wrapper.find('Button').first().props().clickButton()
      wrapper.update()
    })

    expect(wrapper.find('Button').first().props().clicked).toBe(true)
    expect(wrapper.find('.status.lose')).toHaveLength(1)
    expect(wrapper.find('.status.win')).toHaveLength(0)
    expect(wrapper.find('.status.playing')).toHaveLength(0)
  })
})
