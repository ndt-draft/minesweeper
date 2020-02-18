import React from 'react'
import './Button.css'

const Button = props => (
  <button className="square" onClick={props.clickButton}>
    &nbsp;
    {props.clicked ? (!props.mine ? props.hint : 'x') : ''}
    &nbsp;
  </button>
)

export default Button
