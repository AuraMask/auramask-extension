const inherits = require('util').inherits;
const Component = require('react').Component;
const connect = require('react-redux').connect;
const h = require('react-hyperscript');
const {HashRouter} = require('react-router-dom');
const App = require('./app');
const {autoAddToBetaUI} = require('./selectors');
const {setFeatureFlag} = require('./actions');
const I18nProvider = require('./i18n-provider');

function mapStateToProps(state) {
  return {
    betaUI: state.irmeta.featureFlags.betaUI,
    autoAdd: autoAddToBetaUI(state),
    isUnlocked: state.irmeta.isUnlocked,
    isMascara: state.irmeta.isMascara,
    firstTime: Object.keys(state.irmeta.identities).length === 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setFeatureFlagWithModal: () => {
      return dispatch(setFeatureFlag('betaUI', true, 'BETA_UI_NOTIFICATION_MODAL'));
    },
    setFeatureFlagWithoutModal: () => {
      return dispatch(setFeatureFlag('betaUI', true));
    },
  };
}

inherits(SelectedApp, Component);

function SelectedApp() {
  Component.call(this);
}

SelectedApp.prototype.UNSAFE_componentWillReceiveProps = function(nextProps) {
  // Code commented out until we begin auto adding users to NewUI
  const {setFeatureFlagWithoutModal, isMascara} = nextProps;
  if (isMascara) {
    setFeatureFlagWithoutModal();
  }
};

SelectedApp.prototype.render = function() {
  // Code commented out until we begin auto adding users to NewUI
  return h(HashRouter, {hashType: 'noslash'}, [h(I18nProvider, [h(App)])]);
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(SelectedApp);
