import React from 'react'
import {
  hhmmss
} from '../../utils'
import './Playground.css'
import Button from '../Button/Button'
import EndGameModal from '../EndGameModal/EndGameModal'

const Playground = props => {
  const getEndGameTitle = () => {
    let title
    switch (props.status) {
      case 'win':
        title = 'Won in'
        break
      case 'lose':
      default:
        title = 'Lost in'
        break
    }

    return `${title} ${hhmmss(props.elapsedTime)}`
  }

  return (
    <div className="playground" style={{
      width: 30 * props.size
    }}
      data-testid="playground"
    >
      <header className="playground-header">
        <button className={'status ' + props.status} onClick={props.resetGame}/>
        <span className="elapsed-time">
          <span role="img" aria-label="img">&#9200; </span>{hhmmss(props.elapsedTime, 3)}
        </span>
      </header>
      {props.data.map((row, rowIndex) =>
        <div key={rowIndex} className="row">
          {row.map(button =>
            <Button key={`${button.x}${button.y}`} {...button}
              clickButton={props.clickButton.bind(this, button)}
              data-testid="button"
            />
          )}
        </div>
      )}
      <EndGameModal
        isWinOrLose={props.status === 'win' || props.status === 'lose'}
        title={getEndGameTitle()}
        resetGame={props.resetGame}
        changeLevel={props.changeLevel}
      >
      </EndGameModal>
    </div>
  )
}

export default Playground
