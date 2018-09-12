import { connect } from 'react-redux';
import ConfirmTokenTransactionBase from './confirm-token-transaction-base.component';
import {
  tokenAmountAndToAddressSelector,
  contractExchangeRateSelector,
} from '../../../selectors/confirm-transaction';

const mapStateToProps = (state, ownProps) => {
  const { tokenAmount: ownTokenAmount } = ownProps;
  const { confirmTransaction, irmeta: { currentCurrency, conversionRate } } = state;
  const {
    txData: { txParams: { to: tokenAddress } = {} } = {},
    tokenProps: { tokenSymbol } = {},
    fiatTransactionTotal,
    ircTransactionTotal,
  } = confirmTransaction;

  const { tokenAmount, toAddress } = tokenAmountAndToAddressSelector(state);
  const contractExchangeRate = contractExchangeRateSelector(state);

  return {
    toAddress,
    tokenAddress,
    tokenAmount: typeof ownTokenAmount !== 'undefined' ? ownTokenAmount : tokenAmount,
    tokenSymbol,
    currentCurrency,
    conversionRate,
    contractExchangeRate,
    fiatTransactionTotal,
    ircTransactionTotal,
  };
};

export default connect(mapStateToProps)(ConfirmTokenTransactionBase);
