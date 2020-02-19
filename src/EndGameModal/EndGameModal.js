import React from 'react'
import ReactModal from 'react-modal'
import './EndGameModal.css'

const EndGameModal = ({isWinOrLose, title, resetGame, changeLevel}) => {
  return (
    <ReactModal
      isOpen={isWinOrLose}
      onRequestClose={resetGame}
      overlayClassName="modal-overlay"
      className="modal-content"
      ariaHideApp={false}
    >
      <h3>{title}</h3>
      <div className="modal-button">
        <button onClick={resetGame}>New game</button>
      </div>
      <div className="modal-button">
        <button onClick={changeLevel}>Home page</button>
      </div>
    </ReactModal>
  )
}

export default EndGameModal
