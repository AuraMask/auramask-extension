const {Component} = require('react');
const h = require('react-hyperscript');
const {inherits} = require('util');
const {
  formatBalance,
  generateBalanceObject,
} = require('../util');
const Tooltip = require('./tooltip.js');
const FiatValue = require('./fiat-value.js');

module.exports = IrcBalanceComponent;

inherits(IrcBalanceComponent, Component);

function IrcBalanceComponent() {
  Component.call(this);
}

IrcBalanceComponent.prototype.render = function() {
  const props = this.props;
  const {value, style, width, needsParse = true} = props;

  const formattedValue = value ? formatBalance(value, 6, needsParse) : '...';

  return (

    h('.ircer-balance.ircer-balance-amount', {
      style,
    }, [
      h('div', {
        style: {
          display: 'inline',
          width,
        },
      }, this.renderBalance(formattedValue)),
    ])

  );
};
IrcBalanceComponent.prototype.renderBalance = function(value) {
  if (value === 'None') return value;
  if (value === '...') return value;

  const {
    conversionRate,
    shorten,
    incoming,
    currentCurrency,
    hideTooltip,
    styleOveride = {},
    showFiat = true,
  } = this.props;
  const {fontSize, color, fontFamily, lineHeight} = styleOveride;

  const {shortBalance, balance, label} = generateBalanceObject(value, shorten ? 1 : 3);
  const balanceToRender = shorten ? shortBalance : balance;

  const [ircNumber, ircSuffix] = value.split(' ');
  const containerProps = hideTooltip ? {} : {
    position: 'bottom',
    title: `${ircNumber} ${ircSuffix}`,
  };

  return (
    h(
      hideTooltip ? 'div' : Tooltip,
      containerProps,
      h('div.flex-column', [
        h('.flex-row', {
          style: {
            alignItems: 'flex-end',
            lineHeight: lineHeight || '13px',
            fontFamily: fontFamily || 'Montserrat Light',
            textRendering: 'geometricPrecision',
          },
        }, [
          h('div', {
            style: {
              width: '100%',
              textAlign: 'right',
              fontSize: fontSize || 'inherit',
              color: color || 'inherit',
            },
          }, incoming ? `+${balanceToRender}` : balanceToRender),
          h('div', {
            style: {
              color: color || '#AEAEAE',
              fontSize: fontSize || '12px',
              marginLeft: '5px',
            },
          }, label),
        ]),

        showFiat ? h(FiatValue, {value: this.props.value, conversionRate, currentCurrency}) : null,
      ]),
    )
  );
};
