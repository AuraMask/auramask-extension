import { connect } from 'react-redux';
import {
    accountsWithSendIrcerInfoSelector,
    getConversionRate,
    getSelectedTokenContract,
    getSendFromObject,
} from '../../send.selectors.js';
import {
  getFromDropdownOpen,
} from './send-from-row.selectors.js';
import { calcTokenBalance } from '../../send.utils.js';
import {
    updateSendFrom,
    setSendTokenBalance,
} from '../../../../actions';
import {
    closeFromDropdown,
    openFromDropdown,
} from '../../../../ducks/send.duck';
import SendFromRow from './send-from-row.component';

export default connect(mapStateToProps, mapDispatchToProps)(SendFromRow);

function mapStateToProps(state) {
  return {
    conversionRate: getConversionRate(state),
    from: getSendFromObject(state),
    fromAccounts: accountsWithSendIrcerInfoSelector(state),
    fromDropdownOpen: getFromDropdownOpen(state),
    tokenContract: getSelectedTokenContract(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeFromDropdown: () => dispatch(closeFromDropdown()),
    openFromDropdown: () => dispatch(openFromDropdown()),
    updateSendFrom: newFrom => dispatch(updateSendFrom(newFrom)),
    setSendTokenBalance: (usersToken, selectedToken) => {
        if (!usersToken) return;

        const tokenBalance = calcTokenBalance({ usersToken, selectedToken });
        dispatch(setSendTokenBalance(tokenBalance));
    },
  };
}
