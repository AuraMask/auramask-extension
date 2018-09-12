const render = require('react-dom').render;
const h = require('react-hyperscript');
const Root = require('./app/root');
const actions = require('./app/actions');
const configureStore = require('./app/store');
const txHelper = require('./lib/tx-helper');
const {fetchLocale} = require('./i18n-helper');
const log = require('loglevel');

module.exports = launchIrmetaUi;

log.setLevel(global.IRMETA_DEBUG ? 'debug' : 'warn');

function launchIrmetaUi(opts, cb) {
  var accountManager = opts.accountManager;
  actions._setBackgroundConnection(accountManager);
  // check if we are unlocked first
  accountManager.getState((err, state) => {
    if (err) return cb(err);
    startApp(state, accountManager, opts).then(store => cb(null, store));
  });
}

async function startApp(state, accountManager, opts) {
  // parse opts
  if (!state.featureFlags) state.featureFlags = {};

  const currLocale = state.currentLocale ? await fetchLocale(state.currentLocale) : {};
  const enLocaleMessages = await fetchLocale('en');

  const store = configureStore({
    irmeta: state,
    appState: {},
    localeMessages: {
      current: currLocale,
      en: enLocaleMessages,
    },

    // Which blockchain we are using:
    networkVersion: opts.networkVersion,
  });

  // if unconfirmed txs, start on txConf page
  const unapprovedTxsAll = txHelper(
    state.unapprovedTxs,
    state.unapprovedMsgs,
    state.unapprovedPersonalMsgs,
    state.unapprovedTypedMessages,
    state.network);
  const numberOfUnapprivedTx = unapprovedTxsAll.length;
  if (numberOfUnapprivedTx > 0) {
    store.dispatch(actions.showConfTxPage({
      id: unapprovedTxsAll[numberOfUnapprivedTx - 1].id,
    }));
  }

  accountManager.on('update', function(irmetaState) {
    store.dispatch(actions.updateIrmetaState(irmetaState));
  });

  // global irmeta api - used by tooling
  global.irmeta = {
    updateCurrentLocale: (code) => {
      store.dispatch(actions.updateCurrentLocale(code));
    },
    setProviderType: (type) => {
      store.dispatch(actions.setProviderType(type));
    },
  };

  // start app
  render(
    h(Root, {
        // inject initial state
        store: store,
      },
    ), opts.container);

  return store;
}
