import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const {
  tryUnlockIrmeta,
  forgotPassword,
  markPasswordForgotten,
} = require('../../../actions');

import UnlockPage from './unlock-page.component';

const mapStateToProps = state => {
  const { irmeta: { isUnlocked } } = state;
  return {
    isUnlocked,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    forgotPassword: () => dispatch(forgotPassword()),
    tryUnlockIrmeta: password => dispatch(tryUnlockIrmeta(password)),
    markPasswordForgotten: () => dispatch(markPasswordForgotten()),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(UnlockPage);
