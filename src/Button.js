import React from 'react'

const Button = props => (
  <button onClick={props.clickButton}>
    {props.clicked ? (!props.mine ? props.hint : 'x') : ''}
  </button>
)

export default Button
