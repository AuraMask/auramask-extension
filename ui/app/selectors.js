const valuesFor = require('./util').valuesFor;
const abi = require('irc.js').abi.stdTokenAbi;

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
  const selectedAddress = state.irmeta.selectedAddress || Object.keys(state.irmeta.accounts)[0];

  return selectedAddress;
}

function getSelectedIdentity(state) {
  const selectedAddress = getSelectedAddress(state);
  const identities = state.irmeta.identities;

  return identities[selectedAddress];
}

function getSelectedAccount(state) {
  const accounts = state.irmeta.accounts;
  const selectedAddress = getSelectedAddress(state);

  return accounts[selectedAddress];
}

function getSelectedToken(state) {
  const tokens = state.irmeta.tokens || [];
  const selectedTokenAddress = state.irmeta.selectedTokenAddress;
  const selectedToken = tokens.filter(({address}) => address === selectedTokenAddress)[0];
  const sendToken = state.irmeta.send.token;

  return selectedToken || sendToken || null;
}

function getSelectedTokenExchangeRate(state) {
  const contractExchangeRates = state.irmeta.contractExchangeRates;
  const selectedToken = getSelectedToken(state) || {};
  const {address} = selectedToken;
  return contractExchangeRates[address] || 0;
}

function getTokenExchangeRate(state, address) {
  const contractExchangeRates = state.irmeta.contractExchangeRates;
  return contractExchangeRates[address] || 0;
}

function conversionRateSelector(state) {
  return state.irmeta.conversionRate;
}

function getAddressBook(state) {
  return state.irmeta.addressBook;
}

function accountsWithSendIrcerInfoSelector(state) {
  const {
    accounts,
    identities,
  } = state.irmeta;

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
  const {network, selectedTokenAddress} = state.irmeta;
  const unapprovedMsgs = valuesFor(state.irmeta.unapprovedMsgs);
  const shapeShiftTxList = (network === '1') ? state.irmeta.shapeShiftTxList : undefined;
  const transactions = state.irmeta.selectedAddressTxList || [];
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
  return state.irmeta.send.forceGasMin;
}

function getSendFrom(state) {
  return state.irmeta.send.from;
}

function getSendAmount(state) {
  return state.irmeta.send.amount;
}

function getSendMaxModeState(state) {
  return state.irmeta.send.maxModeOn;
}

function getCurrentCurrency(state) {
  return state.irmeta.currentCurrency;
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
  const numberOfTransactions = state.irmeta.selectedAddressTxList.length;
  const numberOfAccounts = Object.keys(state.irmeta.accounts).length;
  const numberOfTokensAdded = state.irmeta.tokens.length;

  const userPassesThreshold = (numberOfTransactions > autoAddTransactionThreshold) &&
    (numberOfAccounts > autoAddAccountsThreshold) &&
    (numberOfTokensAdded > autoAddTokensThreshold);
  const userIsNotInBeta = !state.irmeta.featureFlags.betaUI;

  return userIsNotInBeta && userPassesThreshold;
}

function getCurrentViewContext(state) {
  const {currentView = {}} = state.appState;
  return currentView.context;
}

function getTotalUnapprovedCount({irmeta}) {
  const {
    unapprovedTxs = {},
    unapprovedMsgCount,
    unapprovedPersonalMsgCount,
    unapprovedTypedMessagesCount,
  } = irmeta;

  return Object.keys(unapprovedTxs).length + unapprovedMsgCount + unapprovedPersonalMsgCount +
    unapprovedTypedMessagesCount;
}
