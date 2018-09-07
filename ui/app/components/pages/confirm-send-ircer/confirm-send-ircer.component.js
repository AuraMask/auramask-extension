import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ConfirmTransactionBase from '../confirm-transaction-base';
import {SEND_ROUTE} from '../../../routes';

export default class ConfirmSendIrcer extends Component {
  static get contextTypes() {
    return {
      t: PropTypes.func,
    };
  };

  static get propTypes() {
    return {
      editTransaction: PropTypes.func,
      history: PropTypes.object,
      txParams: PropTypes.object,
    };
  };

  handleEdit({txData}) {
    const {editTransaction, history} = this.props;
    editTransaction(txData);
    history.push(SEND_ROUTE);
  }

  shouldHideData() {
    const {txParams = {}} = this.props;
    return !txParams.data;
  }

  render() {
    const hideData = this.shouldHideData();

    return (
      <ConfirmTransactionBase
        action={this.context.t('confirm')}
        hideData={hideData}
        onEdit={confirmTransactionData => this.handleEdit(confirmTransactionData)}
      />
    );
  }
}
