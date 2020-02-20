import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import store from './store'

test('renders app name', () => {
  const { getByText } = render(<App store={store} />);
  const nameElement = getByText(/Minesweeper/i);
  expect(nameElement).toBeInTheDocument();
});
