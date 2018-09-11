import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SendRowWrapper from '../send-row-wrapper/';
import GasFeeDisplay from './gas-fee-display/gas-fee-display.component';

export default class SendGasRow extends Component {

  static get propTypes() {
    return {
      conversionRate: PropTypes.number,
      convertedCurrency: PropTypes.string,
      primaryCurrency: PropTypes.string,
      gasFeeError: PropTypes.bool,
      gasLoadingError: PropTypes.bool,
      gasTotal: PropTypes.string,
      showCustomizeGasModal: PropTypes.func,
    };
  };

  static get contextTypes() {
    return {
      t: PropTypes.func,
    };
  };

  render() {
    const {
      conversionRate,
      convertedCurrency,
      primaryCurrency,
      gasLoadingError,
      gasTotal,
      gasFeeError,
      showCustomizeGasModal,
    } = this.props;

    return primaryCurrency ? null :
      <SendRowWrapper
        label={`${this.context.t('gasFee')}:`}
        showError={gasFeeError}
        errorType={'gasFee'}>
        <GasFeeDisplay
          conversionRate={conversionRate}
          convertedCurrency={convertedCurrency}
          primaryCurrency={primaryCurrency}
          gasLoadingError={gasLoadingError}
          gasTotal={gasTotal}
          onClick={() => showCustomizeGasModal()}/>
      </SendRowWrapper>;
  }

}
