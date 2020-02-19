import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app name', () => {
  const { getByText } = render(<App />);
  const nameElement = getByText(/Minesweeper/i);
  expect(nameElement).toBeInTheDocument();
});
