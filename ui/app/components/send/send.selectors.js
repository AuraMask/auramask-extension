const {valuesFor} = require('../../util');
const abi = require('human-standard-token-abi');
const {
  multiplyCurrencies,
} = require('../../conversion-util');
const {
  estimateGasPriceFromRecentBlocks,
} = require('./send.utils');

const selectors = {
  accountsWithSendIrcerInfoSelector,
  // autoAddToBetaUI,
  getAddressBook,
  getAmountConversionRate,
  getBlockGasLimit,
  getConversionRate,
  getCurrentAccountWithSendIrcerInfo,
  getCurrentCurrency,
  getCurrentNetwork,
  getCurrentViewContext,
  getForceGasMin,
  getGasLimit,
  getGasPrice,
  getGasPriceFromRecentBlocks,
  getGasTotal,
  getPrimaryCurrency,
  getRecentBlocks,
  getSelectedAccount,
  getSelectedAddress,
  getSelectedIdentity,
  getSelectedToken,
  getSelectedTokenContract,
  getSelectedTokenExchangeRate,
  getSelectedTokenToFiatRate,
  getSendAmount,
  getSendHexData,
  getSendEditingTransactionId,
  getSendErrors,
  getSendFrom,
  getSendFromBalance,
  getSendFromObject,
  getSendMaxModeState,
  getSendTo,
  getSendToAccounts,
  getTokenBalance,
  getTokenExchangeRate,
  getUnapprovedTxs,
  transactionsSelector,
  getQrCodeData,
};

module.exports = selectors;

function accountsWithSendIrcerInfoSelector(state) {
  const {
    accounts,
    identities,
  } = state.auramask;

  const accountsWithSendIrcerInfo = Object.entries(accounts).map(([key, account]) => {
    return Object.assign({}, account, identities[key]);
  });

  return accountsWithSendIrcerInfo;
}

// function autoAddToBetaUI (state) {
//   const autoAddTransactionThreshold = 12
//   const autoAddAccountsThreshold = 2
//   const autoAddTokensThreshold = 1

//   const numberOfTransactions = state.auramask.selectedAddressTxList.length
//   const numberOfAccounts = Object.keys(state.auramask.accounts).length
//   const numberOfTokensAdded = state.auramask.tokens.length

//   const userPassesThreshold = (numberOfTransactions > autoAddTransactionThreshold) &&
//     (numberOfAccounts > autoAddAccountsThreshold) &&
//     (numberOfTokensAdded > autoAddTokensThreshold)
//   const userIsNotInBeta = !state.auramask.featureFlags.betaUI

//   return userIsNotInBeta && userPassesThreshold
// }

function getAddressBook(state) {
  return state.auramask.addressBook;
}

function getAmountConversionRate(state) {
  return getSelectedToken(state)
    ? getSelectedTokenToFiatRate(state)
    : getConversionRate(state);
}

function getBlockGasLimit(state) {
  return state.auramask.currentBlockGasLimit;
}

function getConversionRate(state) {
  return state.auramask.conversionRate;
}

function getCurrentAccountWithSendIrcerInfo(state) {
  const currentAddress = getSelectedAddress(state);
  const accounts = accountsWithSendIrcerInfoSelector(state);

  return accounts.find(({address}) => address === currentAddress);
}

function getCurrentCurrency(state) {
  return state.auramask.currentCurrency;
}

function getCurrentNetwork(state) {
  return state.auramask.network;
}

function getCurrentViewContext(state) {
  const {currentView = {}} = state.appState;
  return currentView.context;
}

function getForceGasMin(state) {
  return state.auramask.send.forceGasMin;
}

function getGasLimit(state) {
  return state.auramask.send.gasLimit;
}

function getGasPrice(state) {
  return state.auramask.send.gasPrice;
}

function getGasPriceFromRecentBlocks(state) {
  return estimateGasPriceFromRecentBlocks(state.auramask.recentBlocks);
}

function getGasTotal(state) {
  return state.auramask.send.gasTotal;
}

function getPrimaryCurrency(state) {
  const selectedToken = getSelectedToken(state);
  return selectedToken && selectedToken.symbol;
}

function getRecentBlocks(state) {
  return state.auramask.recentBlocks;
}

function getSelectedAccount(state) {
  const accounts = state.auramask.accounts;
  const selectedAddress = getSelectedAddress(state);

  return accounts[selectedAddress];
}

function getSelectedAddress(state) {
  const selectedAddress = state.auramask.selectedAddress || Object.keys(state.auramask.accounts)[0];

  return selectedAddress;
}

function getSelectedIdentity(state) {
  const selectedAddress = getSelectedAddress(state);
  const identities = state.auramask.identities;

  return identities[selectedAddress];
}

function getSelectedToken(state) {
  const tokens = state.auramask.tokens || [];
  const selectedTokenAddress = state.auramask.selectedTokenAddress;
  const selectedToken = tokens.filter(({address}) => address === selectedTokenAddress)[0];
  const sendToken = state.auramask.send.token;

  return selectedToken || sendToken || null;
}

function getSelectedTokenContract(state) {
  const selectedToken = getSelectedToken(state);

  return selectedToken
    ? global.irc.contract(abi).at(selectedToken.address)
    : null;
}

function getSelectedTokenExchangeRate(state) {
  const tokenExchangeRates = state.auramask.tokenExchangeRates;
  const selectedToken = getSelectedToken(state) || {};
  const {symbol = ''} = selectedToken;
  const pair = `${symbol.toLowerCase()}_irc`;
  const {rate: tokenExchangeRate = 0} = tokenExchangeRates && tokenExchangeRates[pair] || {};

  return tokenExchangeRate;
}

function getSelectedTokenToFiatRate(state) {
  const selectedTokenExchangeRate = getSelectedTokenExchangeRate(state);
  const conversionRate = getConversionRate(state);

  return multiplyCurrencies(
    conversionRate,
    selectedTokenExchangeRate,
    {toNumericBase: 'dec'},
  );
}

function getSendAmount(state) {
  return state.auramask.send.amount;
}

function getSendHexData(state) {
  return state.auramask.send.data;
}

function getSendEditingTransactionId(state) {
  return state.auramask.send.editingTransactionId;
}

function getSendErrors(state) {
  return state.send.errors;
}

function getSendFrom(state) {
  return state.auramask.send.from;
}

function getSendFromBalance(state) {
  const from = getSendFrom(state) || getSelectedAccount(state);
  return from.balance;
}

function getSendFromObject(state) {
  return getSendFrom(state) || getCurrentAccountWithSendIrcerInfo(state);
}

function getSendMaxModeState(state) {
  return state.auramask.send.maxModeOn;
}

function getSendTo(state) {
  return state.auramask.send.to;
}

function getSendToAccounts(state) {
  const fromAccounts = accountsWithSendIrcerInfoSelector(state);
  const addressBookAccounts = getAddressBook(state);
  const allAccounts = [...fromAccounts, ...addressBookAccounts];
  // TODO: figure out exactly what the below returns and put a descriptive variable name on it
  return Object.entries(allAccounts).map(([key, account]) => account);
}

function getTokenBalance(state) {
  return state.auramask.send.tokenBalance;
}

function getTokenExchangeRate(state, tokenSymbol) {
  const pair = `${tokenSymbol.toLowerCase()}_irc`;
  const tokenExchangeRates = state.auramask.tokenExchangeRates;
  const {rate: tokenExchangeRate = 0} = tokenExchangeRates[pair] || {};

  return tokenExchangeRate;
}

function getUnapprovedTxs(state) {
  return state.auramask.unapprovedTxs;
}

function transactionsSelector(state) {
  const {network, selectedTokenAddress} = state.auramask;
  const unapprovedMsgs = valuesFor(state.auramask.unapprovedMsgs);
  const shapeShiftTxList = (network === '1') ? state.auramask.shapeShiftTxList : undefined;
  const transactions = state.auramask.selectedAddressTxList || [];
  const txsToRender = !shapeShiftTxList ? transactions.concat(unapprovedMsgs) : transactions.concat(unapprovedMsgs, shapeShiftTxList);

  return selectedTokenAddress
    ? txsToRender
      .filter(({txParams}) => txParams && txParams.to === selectedTokenAddress)
      .sort((a, b) => b.time - a.time)
    : txsToRender
      .sort((a, b) => b.time - a.time);
}

function getQrCodeData(state) {
  return state.appState.qrCodeData;
}
