import React, {useState} from 'react'
import ReactModal from 'react-modal'
import './EndGameModal.css'

const EndGameModal = ({isWinOrLose, title, resetGame, changeLevel}) => {
  const [isOpen, setIsOpen] = useState(true)

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <ReactModal
      isOpen={isOpen && isWinOrLose}
      onRequestClose={closeModal}
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
      <div className="modal-button">
        <button onClick={closeModal}>Close</button>
      </div>
    </ReactModal>
  )
}

export default EndGameModal
