import { createSelector } from 'reselect';
import txHelper from '../../lib/tx-helper';
import { calcTokenAmount } from '../token-util';
import { roundExponential } from '../helpers/confirm-transaction/util';

const unapprovedTxsSelector = state => state.auramask.unapprovedTxs;
const unapprovedMsgsSelector = state => state.auramask.unapprovedMsgs;
const unapprovedPersonalMsgsSelector = state => state.auramask.unapprovedPersonalMsgs;
const unapprovedTypedMessagesSelector = state => state.auramask.unapprovedTypedMessages;
const networkSelector = state => state.auramask.network;

export const unconfirmedTransactionsListSelector = createSelector(
  unapprovedTxsSelector,
  unapprovedMsgsSelector,
  unapprovedPersonalMsgsSelector,
  unapprovedTypedMessagesSelector,
  networkSelector,
  (
    unapprovedTxs = {},
    unapprovedMsgs = {},
    unapprovedPersonalMsgs = {},
    unapprovedTypedMessages = {},
    network
  ) => txHelper(
    unapprovedTxs,
    unapprovedMsgs,
    unapprovedPersonalMsgs,
    unapprovedTypedMessages,
    network
  ) || []
);

export const unconfirmedTransactionsHashSelector = createSelector(
  unapprovedTxsSelector,
  unapprovedMsgsSelector,
  unapprovedPersonalMsgsSelector,
  unapprovedTypedMessagesSelector,
  networkSelector,
  (
    unapprovedTxs = {},
    unapprovedMsgs = {},
    unapprovedPersonalMsgs = {},
    unapprovedTypedMessages = {},
    network
  ) => {
    const filteredUnapprovedTxs = Object.keys(unapprovedTxs).reduce((acc, address) => {
      const { auramaskNetworkId } = unapprovedTxs[address];
      const transactions = { ...acc };

      if (auramaskNetworkId === network) {
        transactions[address] = unapprovedTxs[address];
      }

      return transactions;
    }, {});

    return {
      ...filteredUnapprovedTxs,
      ...unapprovedMsgs,
      ...unapprovedPersonalMsgs,
      ...unapprovedTypedMessages,
    };
  }
);

const unapprovedMsgCountSelector = state => state.auramask.unapprovedMsgCount;
const unapprovedPersonalMsgCountSelector = state => state.auramask.unapprovedPersonalMsgCount;
const unapprovedTypedMessagesCountSelector = state => state.auramask.unapprovedTypedMessagesCount;

export const unconfirmedTransactionsCountSelector = createSelector(
  unapprovedTxsSelector,
  unapprovedMsgCountSelector,
  unapprovedPersonalMsgCountSelector,
  unapprovedTypedMessagesCountSelector,
  networkSelector,
  (
    unapprovedTxs = {},
    unapprovedMsgCount = 0,
    unapprovedPersonalMsgCount = 0,
    unapprovedTypedMessagesCount = 0,
    network
  ) => {
    const filteredUnapprovedTxIds = Object.keys(unapprovedTxs).filter(txId => {
      const { auramaskNetworkId } = unapprovedTxs[txId];
      return auramaskNetworkId === network;
    });

    return filteredUnapprovedTxIds.length + unapprovedTypedMessagesCount + unapprovedMsgCount +
      unapprovedPersonalMsgCount;
  }
);


export const currentCurrencySelector = state => state.auramask.currentCurrency;
export const conversionRateSelector = state => state.auramask.conversionRate;

const txDataSelector = state => state.confirmTransaction.txData;
const tokenDataSelector = state => state.confirmTransaction.tokenData;
const tokenPropsSelector = state => state.confirmTransaction.tokenProps;

const contractExchangeRatesSelector = state => state.auramask.contractExchangeRates;

const tokenDecimalsSelector = createSelector(
  tokenPropsSelector,
  tokenProps => tokenProps && tokenProps.tokenDecimals
);

const tokenDataParamsSelector = createSelector(
  tokenDataSelector,
  tokenData => tokenData && tokenData.params || []
);

const txParamsSelector = createSelector(
  txDataSelector,
  txData => txData && txData.txParams || {}
);

export const tokenAddressSelector = createSelector(
  txParamsSelector,
  txParams => txParams && txParams.to
);

const TOKEN_PARAM_SPENDER = '_spender';
const TOKEN_PARAM_TO = '_to';
const TOKEN_PARAM_VALUE = '_value';

export const tokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  params => {
    let toAddress = '';
    let tokenAmount = 0;

    if (params && params.length) {
      const toParam = params.find(param => param.name === TOKEN_PARAM_TO);
      const valueParam = params.find(param => param.name === TOKEN_PARAM_VALUE);
      toAddress = toParam ? toParam.value : params[0].value;
      const value = valueParam ? Number(valueParam.value) : Number(params[1].value);
      tokenAmount = roundExponential(value);
    }

    return {
      toAddress,
      tokenAmount,
    };
  }
);

export const approveTokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  tokenDecimalsSelector,
  (params, tokenDecimals) => {
    let toAddress = '';
    let tokenAmount = 0;

    if (params && params.length) {
      toAddress = params.find(param => param.name === TOKEN_PARAM_SPENDER).value;
      const value = Number(params.find(param => param.name === TOKEN_PARAM_VALUE).value);

      if (tokenDecimals) {
        tokenAmount = calcTokenAmount(value, tokenDecimals);
      }

      tokenAmount = roundExponential(tokenAmount);
    }

    return {
      toAddress,
      tokenAmount,
    };
  }
);

export const sendTokenTokenAmountAndToAddressSelector = createSelector(
  tokenDataParamsSelector,
  tokenDecimalsSelector,
  (params, tokenDecimals) => {
    let toAddress = '';
    let tokenAmount = 0;

    if (params && params.length) {
      toAddress = params.find(param => param.name === TOKEN_PARAM_TO).value;
      let value = Number(params.find(param => param.name === TOKEN_PARAM_VALUE).value);

      if (tokenDecimals) {
        value = calcTokenAmount(value, tokenDecimals);
      }

      tokenAmount = roundExponential(value);
    }

    return {
      toAddress,
      tokenAmount,
    };
  }
);

export const contractExchangeRateSelector = createSelector(
  contractExchangeRatesSelector,
  tokenAddressSelector,
  (contractExchangeRates, tokenAddress) => contractExchangeRates[tokenAddress]
);
