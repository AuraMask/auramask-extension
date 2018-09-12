const extend = require('xtend');
const actions = require('../actions');
const AuramascaraPlatform = require('../../../app/scripts/platforms/window');
const {getEnvironmentType} = require('../../../app/scripts/lib/util');
const {ENVIRONMENT_TYPE_POPUP} = require('../../../app/scripts/lib/enums');

module.exports = reduceIrmeta;

function reduceIrmeta(state, action) {
  let newState;

  // clone + defaults
  var irmetaState = extend({
    isInitialized: false,
    isUnlocked: false,
    isAccountMenuOpen: false,
    isMascara: window.platform instanceof AuramascaraPlatform,
    isPopup: getEnvironmentType(window.location.href) === ENVIRONMENT_TYPE_POPUP,
    rpcTarget: 'http://localhost:8545/',
    identities: {},
    unapprovedTxs: {},
    noActiveNotices: true,
    nextUnreadNotice: undefined,
    frequentRpcList: [],
    addressBook: [],
    selectedTokenAddress: null,
    contractExchangeRates: {},
    tokenExchangeRates: {},
    tokens: [],
    pendingTokens: {},
    send: {
      gasLimit: null,
      gasPrice: null,
      gasTotal: null,
      tokenBalance: null,
      from: '',
      to: '',
      amount: '0x0',
      memo: '',
      errors: {},
      maxModeOn: false,
      editingTransactionId: null,
      forceGasMin: null,
      toNickname: '',
    },
    coinOptions: {},
    useBlockie: false,
    featureFlags: {},
    isRevealingSeedWords: false,
    welcomeScreenSeen: false,
    currentLocale: '',
  }, state.irmeta);

  switch (action.type) {

    case actions.SHOW_ACCOUNTS_PAGE:
      newState = extend(irmetaState, {
        isRevealingSeedWords: false,
      });
      delete newState.seedWords;
      return newState;

    case actions.SHOW_NOTICE:
      return extend(irmetaState, {
        noActiveNotices: false,
        nextUnreadNotice: action.value,
      });

    case actions.CLEAR_NOTICES:
      return extend(irmetaState, {
        noActiveNotices: true,
      });

    case actions.UPDATE_IRMETA_STATE:
      return extend(irmetaState, action.value);

    case actions.UNLOCK_IRMETA:
      return extend(irmetaState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });

    case actions.LOCK_IRMETA:
      return extend(irmetaState, {
        isUnlocked: false,
      });

    case actions.SET_RPC_LIST:
      return extend(irmetaState, {
        frequentRpcList: action.value,
      });

    case actions.SET_RPC_TARGET:
      return extend(irmetaState, {
        provider: {
          type: 'rpc',
          rpcTarget: action.value,
        },
      });

    case actions.SET_PROVIDER_TYPE:
      return extend(irmetaState, {
        provider: {
          type: action.value,
        },
      });

    case actions.COMPLETED_TX:
      var stringId = String(action.id);
      newState = extend(irmetaState, {
        unapprovedTxs: {},
        unapprovedMsgs: {},
      });
      for (const id in irmetaState.unapprovedTxs) {
        if (id !== stringId) {
          newState.unapprovedTxs[id] = irmetaState.unapprovedTxs[id];
        }
      }
      for (const id in irmetaState.unapprovedMsgs) {
        if (id !== stringId) {
          newState.unapprovedMsgs[id] = irmetaState.unapprovedMsgs[id];
        }
      }
      return newState;

    case actions.EDIT_TX:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          editingTransactionId: action.value,
        },
      });

    case actions.SHOW_NEW_VAULT_SEED:
      return extend(irmetaState, {
        isRevealingSeedWords: true,
        seedWords: action.value,
      });

    case actions.CLEAR_SEED_WORD_CACHE:
      newState = extend(irmetaState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case actions.SHOW_ACCOUNT_DETAIL:
      newState = extend(irmetaState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case actions.SET_SELECTED_TOKEN:
      return extend(irmetaState, {
        selectedTokenAddress: action.value,
      });

    case actions.SET_ACCOUNT_LABEL:
      const account = action.value.account;
      const name = action.value.label;
      const id = {};
      id[account] = extend(irmetaState.identities[account], {name});
      const identities = extend(irmetaState.identities, id);
      return extend(irmetaState, {identities});

    case actions.SET_CURRENT_FIAT:
      return extend(irmetaState, {
        currentCurrency: action.value.currentCurrency,
        conversionRate: action.value.conversionRate,
        conversionDate: action.value.conversionDate,
      });

    case actions.UPDATE_TOKENS:
      return extend(irmetaState, {
        tokens: action.newTokens,
      });

    // irmeta.send
    case actions.UPDATE_GAS_LIMIT:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          gasLimit: action.value,
        },
      });

    case actions.UPDATE_GAS_PRICE:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          gasPrice: action.value,
        },
      });

    case actions.TOGGLE_ACCOUNT_MENU:
      return extend(irmetaState, {
        isAccountMenuOpen: !irmetaState.isAccountMenuOpen,
      });

    case actions.UPDATE_GAS_TOTAL:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          gasTotal: action.value,
        },
      });

    case actions.UPDATE_SEND_TOKEN_BALANCE:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          tokenBalance: action.value,
        },
      });

    case actions.UPDATE_SEND_HEX_DATA:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          data: action.value,
        },
      });

    case actions.UPDATE_SEND_FROM:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          from: action.value,
        },
      });

    case actions.UPDATE_SEND_TO:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          to: action.value.to,
          toNickname: action.value.nickname,
        },
      });

    case actions.UPDATE_SEND_AMOUNT:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          amount: action.value,
        },
      });

    case actions.UPDATE_SEND_MEMO:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          memo: action.value,
        },
      });

    case actions.UPDATE_MAX_MODE:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          maxModeOn: action.value,
        },
      });

    case actions.UPDATE_SEND:
      return extend(irmetaState, {
        send: {
          ...irmetaState.send,
          ...action.value,
        },
      });

    case actions.CLEAR_SEND:
      return extend(irmetaState, {
        send: {
          gasLimit: null,
          gasPrice: null,
          gasTotal: null,
          tokenBalance: null,
          from: '',
          to: '',
          amount: '0x0',
          memo: '',
          errors: {},
          editingTransactionId: null,
          forceGasMin: null,
        },
      });

    case actions.UPDATE_TRANSACTION_PARAMS:
      const {id: txId, value} = action;
      let {selectedAddressTxList} = irmetaState;
      selectedAddressTxList = selectedAddressTxList.map(tx => {
        if (tx.id === txId) {
          tx.txParams = value;
        }
        return tx;
      });

      return extend(irmetaState, {
        selectedAddressTxList,
      });

    case actions.PAIR_UPDATE:
      const {value: {marketinfo: pairMarketInfo}} = action;
      return extend(irmetaState, {
        tokenExchangeRates: {
          ...irmetaState.tokenExchangeRates,
          [pairMarketInfo.pair]: pairMarketInfo,
        },
      });

    case actions.SHAPESHIFT_SUBVIEW:
      const {value: {marketinfo: ssMarketInfo, coinOptions}} = action;
      return extend(irmetaState, {
        tokenExchangeRates: {
          ...irmetaState.tokenExchangeRates,
          [ssMarketInfo.pair]: ssMarketInfo,
        },
        coinOptions,
      });

    case actions.SET_USE_BLOCKIE:
      return extend(irmetaState, {
        useBlockie: action.value,
      });

    case actions.UPDATE_FEATURE_FLAGS:
      return extend(irmetaState, {
        featureFlags: action.value,
      });

    case actions.UPDATE_NETWORK_ENDPOINT_TYPE:
      return extend(irmetaState, {
        networkEndpointType: action.value,
      });

    case actions.CLOSE_WELCOME_SCREEN:
      return extend(irmetaState, {
        welcomeScreenSeen: true,
      });

    case actions.SET_CURRENT_LOCALE:
      return extend(irmetaState, {
        currentLocale: action.value,
      });

    case actions.SET_PENDING_TOKENS:
      return extend(irmetaState, {
        pendingTokens: {...action.payload},
      });

    case actions.CLEAR_PENDING_TOKENS: {
      return extend(irmetaState, {
        pendingTokens: {},
      });
    }

    default:
      return irmetaState;

  }
}
