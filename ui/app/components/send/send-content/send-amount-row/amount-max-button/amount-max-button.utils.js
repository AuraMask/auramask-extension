const {
  multiplyCurrencies,
  subtractCurrencies,
} = require('../../../../../conversion-util');
const ircUtil = require('icjs-util');

function calcMaxAmount({ balance, gasTotal, selectedToken, tokenBalance }) {
    const { decimals } = selectedToken || {};
    const multiplier = Math.pow(10, Number(decimals || 0));

    return selectedToken
      ? multiplyCurrencies(tokenBalance, multiplier, {toNumericBase: 'hex'})
      : subtractCurrencies(
        ircUtil.addHexPrefix(balance),
        ircUtil.addHexPrefix(gasTotal),
        { toNumericBase: 'hex' }
      );
}

module.exports = {
  calcMaxAmount,
};
