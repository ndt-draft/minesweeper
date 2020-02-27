import React from 'react'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount } from 'enzyme'

import Playground from '../Playground'
import EndGameModal from '../../EndGameModal/EndGameModal'

Enzyme.configure({ adapter: new Adapter() });

test('shadow render', () => {
  const wrapper = shallow(<Playground data={[]}/>)
  expect(wrapper.find('.playground-header').html()).toContain('elapsed-time')
  expect(wrapper.find(EndGameModal)).toHaveLength(1)
})
