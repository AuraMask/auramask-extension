const {Component} = require('react');
const PropTypes = require('prop-types');
const {Provider} = require('react-redux'); // flex-column
const h = require('react-hyperscript');
const SelectedApp = require('./select-app');

class Root extends Component {
  render() {
    const store = this.props.store;
    return h(Provider, {store}, [h(SelectedApp)]);
  }
}

Root.propTypes = {
  store: PropTypes.object,
};

module.exports = Root;
