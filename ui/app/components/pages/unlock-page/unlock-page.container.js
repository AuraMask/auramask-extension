import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

const {
  tryUnlockAuramask,
  forgotPassword,
  markPasswordForgotten,
} = require('../../../actions')

import UnlockPage from './unlock-page.component'

const mapStateToProps = state => {
  const { auramask: { isUnlocked } } = state
  return {
    isUnlocked,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockAuramask: password => dispatch(tryUnlockAuramask(password)),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(UnlockPage)
