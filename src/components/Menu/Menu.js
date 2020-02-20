import React from 'react'
import './Menu.css'

const Menu = props => {
  const play = e => {
    e.preventDefault()
    props.setSize(Number(e.target.elements.size.value))
  }

  if (props.size !== null) {
    return <button onClick={props.changeLevel}>Change level</button>
  }

  return (
    <form className="menu" onSubmit={play}>
      <b className="menu-title">Select level</b>

      <div className="menu-sizes">
        {props.sizes.map(s =>
          <div key={s.value} className="size-option">
            <label>
              <input required name="size" type="radio" value={s.value}/><span>{s.label}</span>
            </label>
          </div>
        )}
      </div>
      <button className="menu-submit" type="submit">Start</button>
    </form>
  )
}

export default Menu
