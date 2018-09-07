const valuesFor = require('./util').valuesFor;
const abi = require('human-standard-token-abi');

const {
  multiplyCurrencies,
} = require('./conversion-util');

const selectors = {
  getSelectedAddress,
  getSelectedIdentity,
  getSelectedAccount,
  getSelectedToken,
  getSelectedTokenExchangeRate,
  getTokenExchangeRate,
  conversionRateSelector,
  transactionsSelector,
  accountsWithSendIrcerInfoSelector,
  getCurrentAccountWithSendIrcerInfo,
  getGasIsLoading,
  getForceGasMin,
  getAddressBook,
  getSendFrom,
  getCurrentCurrency,
  getSendAmount,
  getSelectedTokenToFiatRate,
  getSelectedTokenContract,
  autoAddToBetaUI,
  getSendMaxModeState,
  getCurrentViewContext,
  getTotalUnapprovedCount,
};

module.exports = selectors;

function getSelectedAddress(state) {
  const selectedAddress = state.auramask.selectedAddress || Object.keys(state.auramask.accounts)[0];

  return selectedAddress;
}

function getSelectedIdentity(state) {
  const selectedAddress = getSelectedAddress(state);
  const identities = state.auramask.identities;

  return identities[selectedAddress];
}

function getSelectedAccount(state) {
  const accounts = state.auramask.accounts;
  const selectedAddress = getSelectedAddress(state);

  return accounts[selectedAddress];
}

function getSelectedToken(state) {
  const tokens = state.auramask.tokens || [];
  const selectedTokenAddress = state.auramask.selectedTokenAddress;
  const selectedToken = tokens.filter(({address}) => address === selectedTokenAddress)[0];
  const sendToken = state.auramask.send.token;

  return selectedToken || sendToken || null;
}

function getSelectedTokenExchangeRate(state) {
  const contractExchangeRates = state.auramask.contractExchangeRates;
  const selectedToken = getSelectedToken(state) || {};
  const {address} = selectedToken;
  return contractExchangeRates[address] || 0;
}

function getTokenExchangeRate(state, address) {
  const contractExchangeRates = state.auramask.contractExchangeRates;
  return contractExchangeRates[address] || 0;
}

function conversionRateSelector(state) {
  return state.auramask.conversionRate;
}

function getAddressBook(state) {
  return state.auramask.addressBook;
}

function accountsWithSendIrcerInfoSelector(state) {
  const {
    accounts,
    identities,
  } = state.auramask;

  return Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key]);
  });
}

function getCurrentAccountWithSendIrcerInfo(state) {
  const currentAddress = getSelectedAddress(state);
  const accounts = accountsWithSendIrcerInfoSelector(state);

  return accounts.find(({address}) => address === currentAddress);
}

function transactionsSelector(state) {
  const {network, selectedTokenAddress} = state.auramask;
  const unapprovedMsgs = valuesFor(state.auramask.unapprovedMsgs);
  const shapeShiftTxList = (network === '1') ? state.auramask.shapeShiftTxList : undefined;
  const transactions = state.auramask.selectedAddressTxList || [];
  const txsToRender = !shapeShiftTxList ? transactions.concat(unapprovedMsgs) : transactions.concat(unapprovedMsgs, shapeShiftTxList);

  // console.log({txsToRender, selectedTokenAddress})
  return selectedTokenAddress
    ? txsToRender
      .filter(({txParams}) => txParams !== undefined && txParams.to === selectedTokenAddress)
      .sort((a, b) => b.time - a.time)
    : txsToRender
      .sort((a, b) => b.time - a.time);
}

function getGasIsLoading(state) {
  return state.appState.gasIsLoading;
}

function getForceGasMin(state) {
  return state.auramask.send.forceGasMin;
}

function getSendFrom(state) {
  return state.auramask.send.from;
}

function getSendAmount(state) {
  return state.auramask.send.amount;
}

function getSendMaxModeState(state) {
  return state.auramask.send.maxModeOn;
}

function getCurrentCurrency(state) {
  return state.auramask.currentCurrency;
}

function getSelectedTokenToFiatRate(state) {
  const selectedTokenExchangeRate = getSelectedTokenExchangeRate(state);
  const conversionRate = conversionRateSelector(state);

  const tokenToFiatRate = multiplyCurrencies(
    conversionRate,
    selectedTokenExchangeRate,
    {toNumericBase: 'dec'},
  );

  return tokenToFiatRate;
}

function getSelectedTokenContract(state) {
  const selectedToken = getSelectedToken(state);
  return selectedToken
    ? global.irc.contract(abi).at(selectedToken.address)
    : null;
}

function autoAddToBetaUI(state) {
  const autoAddTransactionThreshold = 12;
  const autoAddAccountsThreshold = 2;
  const autoAddTokensThreshold = 1;

  // const
  const numberOfTransactions = state.auramask.selectedAddressTxList.length;
  const numberOfAccounts = Object.keys(state.auramask.accounts).length;
  const numberOfTokensAdded = state.auramask.tokens.length;

  const userPassesThreshold = (numberOfTransactions > autoAddTransactionThreshold) &&
    (numberOfAccounts > autoAddAccountsThreshold) &&
    (numberOfTokensAdded > autoAddTokensThreshold);
  const userIsNotInBeta = !state.auramask.featureFlags.betaUI;

  return userIsNotInBeta && userPassesThreshold;
}

function getCurrentViewContext(state) {
  const {currentView = {}} = state.appState;
  return currentView.context;
}

function getTotalUnapprovedCount({auramask}) {
  const {
    unapprovedTxs = {},
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
  } = auramask;

  return Object.keys(unapprovedTxs).length + unapprovedMsgCount + unapprovedPersonalMsgCount +
    unapprovedTypedMessagesCount;
}
