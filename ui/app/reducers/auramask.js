const extend = require('xtend');
const actions = require('../actions');
const AuramascaraPlatform = require('../../../app/scripts/platforms/window');
const {getEnvironmentType} = require('../../../app/scripts/lib/util');
const {ENVIRONMENT_TYPE_POPUP} = require('../../../app/scripts/lib/enums');
const {OLD_UI_NETWORK_TYPE} = require('../../../app/scripts/controllers/network/enums');

module.exports = reduceAuramask;

function reduceAuramask(state, action) {
  let newState;

  // clone + defaults
  var auramaskState = extend({
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
    networkEndpointType: OLD_UI_NETWORK_TYPE,
    isRevealingSeedWords: false,
    welcomeScreenSeen: false,
    currentLocale: '',
  }, state.auramask);

  switch (action.type) {

    case actions.SHOW_ACCOUNTS_PAGE:
      newState = extend(auramaskState, {
        isRevealingSeedWords: false,
      });
      delete newState.seedWords;
      return newState;

    case actions.SHOW_NOTICE:
      return extend(auramaskState, {
        noActiveNotices: false,
        nextUnreadNotice: action.value,
      });

    case actions.CLEAR_NOTICES:
      return extend(auramaskState, {
        noActiveNotices: true,
      });

    case actions.UPDATE_AURAMASK_STATE:
      return extend(auramaskState, action.value);

    case actions.UNLOCK_AURAMASK:
      return extend(auramaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });

    case actions.LOCK_AURAMASK:
      return extend(auramaskState, {
        isUnlocked: false,
      });

    case actions.SET_RPC_LIST:
      return extend(auramaskState, {
        frequentRpcList: action.value,
      });

    case actions.SET_RPC_TARGET:
      return extend(auramaskState, {
        provider: {
          type: 'rpc',
          rpcTarget: action.value,
        },
      });

    case actions.SET_PROVIDER_TYPE:
      return extend(auramaskState, {
        provider: {
          type: action.value,
        },
      });

    case actions.COMPLETED_TX:
      var stringId = String(action.id);
      newState = extend(auramaskState, {
        unapprovedTxs: {},
        unapprovedMsgs: {},
      });
      for (const id in auramaskState.unapprovedTxs) {
        if (id !== stringId) {
          newState.unapprovedTxs[id] = auramaskState.unapprovedTxs[id];
        }
      }
      for (const id in auramaskState.unapprovedMsgs) {
        if (id !== stringId) {
          newState.unapprovedMsgs[id] = auramaskState.unapprovedMsgs[id];
        }
      }
      return newState;

    case actions.EDIT_TX:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          editingTransactionId: action.value,
        },
      });

    case actions.SHOW_NEW_VAULT_SEED:
      return extend(auramaskState, {
        isRevealingSeedWords: true,
        seedWords: action.value,
      });

    case actions.CLEAR_SEED_WORD_CACHE:
      newState = extend(auramaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case actions.SHOW_ACCOUNT_DETAIL:
      newState = extend(auramaskState, {
        isUnlocked: true,
        isInitialized: true,
        selectedAddress: action.value,
      });
      delete newState.seedWords;
      return newState;

    case actions.SET_SELECTED_TOKEN:
      return extend(auramaskState, {
        selectedTokenAddress: action.value,
      });

    case actions.SET_ACCOUNT_LABEL:
      const account = action.value.account;
      const name = action.value.label;
      const id = {};
      id[account] = extend(auramaskState.identities[account], {name});
      const identities = extend(auramaskState.identities, id);
      return extend(auramaskState, {identities});

    case actions.SET_CURRENT_FIAT:
      return extend(auramaskState, {
        currentCurrency: action.value.currentCurrency,
        conversionRate: action.value.conversionRate,
        conversionDate: action.value.conversionDate,
      });

    case actions.UPDATE_TOKENS:
      return extend(auramaskState, {
        tokens: action.newTokens,
      });

    // auramask.send
    case actions.UPDATE_GAS_LIMIT:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          gasLimit: action.value,
        },
      });

    case actions.UPDATE_GAS_PRICE:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          gasPrice: action.value,
        },
      });

    case actions.TOGGLE_ACCOUNT_MENU:
      return extend(auramaskState, {
        isAccountMenuOpen: !auramaskState.isAccountMenuOpen,
      });

    case actions.UPDATE_GAS_TOTAL:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          gasTotal: action.value,
        },
      });

    case actions.UPDATE_SEND_TOKEN_BALANCE:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          tokenBalance: action.value,
        },
      });

    case actions.UPDATE_SEND_HEX_DATA:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          data: action.value,
        },
      });

    case actions.UPDATE_SEND_FROM:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          from: action.value,
        },
      });

    case actions.UPDATE_SEND_TO:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          to: action.value.to,
          toNickname: action.value.nickname,
        },
      });

    case actions.UPDATE_SEND_AMOUNT:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          amount: action.value,
        },
      });

    case actions.UPDATE_SEND_MEMO:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          memo: action.value,
        },
      });

    case actions.UPDATE_MAX_MODE:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          maxModeOn: action.value,
        },
      });

    case actions.UPDATE_SEND:
      return extend(auramaskState, {
        send: {
          ...auramaskState.send,
          ...action.value,
        },
      });

    case actions.CLEAR_SEND:
      return extend(auramaskState, {
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
      let {selectedAddressTxList} = auramaskState;
      selectedAddressTxList = selectedAddressTxList.map(tx => {
        if (tx.id === txId) {
          tx.txParams = value;
        }
        return tx;
      });

      return extend(auramaskState, {
        selectedAddressTxList,
      });

    case actions.PAIR_UPDATE:
      const {value: {marketinfo: pairMarketInfo}} = action;
      return extend(auramaskState, {
        tokenExchangeRates: {
          ...auramaskState.tokenExchangeRates,
          [pairMarketInfo.pair]: pairMarketInfo,
        },
      });

    case actions.SHAPESHIFT_SUBVIEW:
      const {value: {marketinfo: ssMarketInfo, coinOptions}} = action;
      return extend(auramaskState, {
        tokenExchangeRates: {
          ...auramaskState.tokenExchangeRates,
          [ssMarketInfo.pair]: ssMarketInfo,
        },
        coinOptions,
      });

    case actions.SET_USE_BLOCKIE:
      return extend(auramaskState, {
        useBlockie: action.value,
      });

    case actions.UPDATE_FEATURE_FLAGS:
      return extend(auramaskState, {
        featureFlags: action.value,
      });

    case actions.UPDATE_NETWORK_ENDPOINT_TYPE:
      return extend(auramaskState, {
        networkEndpointType: action.value,
      });

    case actions.CLOSE_WELCOME_SCREEN:
      return extend(auramaskState, {
        welcomeScreenSeen: true,
      });

    case actions.SET_CURRENT_LOCALE:
      return extend(auramaskState, {
        currentLocale: action.value,
      });

    case actions.SET_PENDING_TOKENS:
      return extend(auramaskState, {
        pendingTokens: {...action.payload},
      });

    case actions.CLEAR_PENDING_TOKENS: {
      return extend(auramaskState, {
        pendingTokens: {},
      });
    }

    default:
      return auramaskState;

  }
}
