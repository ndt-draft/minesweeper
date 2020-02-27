import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders normal button', () => {
  const clickButton = jest.fn()
  const { getByTestId } = render(<Button clickButton={clickButton}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square')
  expect(buttonElement).not.toHaveClass('clicked hint bomb boom')
  fireEvent.click(buttonElement)
  expect(clickButton).toHaveBeenCalled()
});

test('renders non-clicked mine button', () => {
  const { getByTestId } = render(<Button clicked={false} mine={true}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square')
  expect(buttonElement).not.toHaveClass('clicked hint bomb boom')
});

test('renders non-clicked hint button', () => {
  const { getByTestId } = render(<Button clicked={false} hint={2}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square')
  expect(buttonElement).not.toHaveClass('clicked hint bomb boom')
});

test('renders clicked empty button', () => {
  const { getByTestId } = render(<Button clicked={true} hint={0}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square clicked')
  expect(buttonElement).not.toHaveClass('hint bomb boom')
});

test('renders clicked mine button', () => {
  const { getByTestId } = render(<Button clicked={true} mine={true}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square clicked bomb')
  expect(buttonElement).not.toHaveClass('hint boom')
});

test('renders clicked hint button', () => {
  const { getByTestId } = render(<Button clicked={true} hint={2}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square clicked hint')
  expect(buttonElement).not.toHaveClass('bomb boom')
  expect(buttonElement.innerHTML).toEqual('&nbsp;2&nbsp;')
});

test('renders boom button', () => {
  const { getByTestId } = render(<Button clicked={true} mine={true} boom={true}/>);
  const buttonElement = getByTestId('button')
  expect(buttonElement).toHaveClass('square clicked bomb boom')
  expect(buttonElement).not.toHaveClass('hint')
});
