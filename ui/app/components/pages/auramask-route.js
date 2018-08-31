const {connect} = require('react-redux');
const PropTypes = require('prop-types');
const {Route} = require('react-router-dom');
const h = require('react-hyperscript');

const AuramaskRoute = ({component, mascaraComponent, isMascara, ...props}) => {
  return (
    h(Route, {
      ...props,
      component: isMascara && mascaraComponent ? mascaraComponent : component,
    })
  );
};

AuramaskRoute.propTypes = {
  component: PropTypes.func,
  mascaraComponent: PropTypes.func,
  isMascara: PropTypes.bool,
};

const mapStateToProps = state => {
  const {auramask: {isMascara}} = state;
  return {
    isMascara,
  };
};

module.exports = connect(mapStateToProps)(AuramaskRoute);
