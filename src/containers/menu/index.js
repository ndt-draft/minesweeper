import { connect } from 'react-redux'
import Menu from '../../components/Menu/Menu'
import {setSize, changeLevel} from '../../reducers/game'

const mapStateToProps = state => ({
  size: state.game.size,
  sizes: state.game.sizes
})

const mapDispatchToProps = {
  setSize,
  changeLevel
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)
