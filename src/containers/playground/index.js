import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import Playground from '../../components/Playground/Playground'
import {setSize, setGameData, fetchMines, clickButton, setElapsedTime, resetGame, changeLevel} from '../../reducers/game'

const PlaygroundContainer = props => {
  const {loading, fetchMines, size, setElapsedTime, status, elapsedTime} = props

  useEffect(() => {
    if (size) {
      fetchMines(size)
    }
  }, [fetchMines, size])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (elapsedTime === 0) return
      setElapsedTime(elapsedTime + 1)
    }, 1000)

    if (status !== 'playing') {
      clearTimeout(timeout)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [setElapsedTime, status, elapsedTime])

  if (size === null) {
    return <div/>
  }

  return loading ?
    <div className="loading">Loading...</div> :
    <Playground {...props}/>
}

const mapStateToProps = state => ({
  size: state.game.size,
  loading: state.game.loading,
  mines: state.game.mines,
  data: state.game.data,
  status: state.game.status,
  elapsedTime: state.game.elapsedTime
})

const mapDispatchToProps = {
  setSize,
  setGameData,
  fetchMines,
  clickButton,
  setElapsedTime,
  resetGame,
  changeLevel
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaygroundContainer)
