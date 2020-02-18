import React from 'react'
import './Menu.css'

const Menu = props => {
  const play = e => {
    e.preventDefault()
    props.setSize(Number(e.target.elements.size.value))
  }

  const changeLevel = () => {
    props.setSize(null)
  }

  if (props.size !== null) {
    return <button onClick={changeLevel}>Change level</button>
  }

  return (
    <form onSubmit={play}>
      <b>Select level</b>

      {props.sizes.map(s =>
        <div key={s.value} className="size-option">
          <label>
            <input required name="size" type="radio" value={s.value}/><span>{s.label}</span>
          </label>
        </div>
      )}
      <button type="submit">Start</button>
    </form>
  )
}

export default Menu
