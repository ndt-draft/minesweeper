import React from 'react'
import classNames from 'classnames'
import './Button.css'

const Button = props => {
  const getButtonText = () => {
    if (props.clicked) {
      if (props.mine) {
        return ''
      }

      return props.hint || ''
    }

    return ''
  }

  return (
    <button className={classNames({
      square: true,
      clicked: props.clicked,
      hint: props.clicked && props.hint,
      bomb: props.clicked && props.mine
    })} onClick={props.clickButton}>
      &nbsp;
      {getButtonText()}
      &nbsp;
    </button>
  )
}

export default Button
