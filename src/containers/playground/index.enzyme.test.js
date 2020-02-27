import React from 'react'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import Playground from './index'
import gameReducer, {fetchMines, SET_GAME_DATA, initialState} from '../../reducers/game'

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
