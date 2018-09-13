const Component = require('react').Component;
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const inherits = require('util').inherits;
const connect = require('react-redux').connect;
const actions = require('../../actions');
const ShapeshiftForm = require('../shapeshift-form');
const {getNetworkDisplayName} = require('../../../../app/scripts/controllers/network/util');

let DIRECT_DEPOSIT_ROW_TITLE;
let DIRECT_DEPOSIT_ROW_TEXT;
let COINBASE_ROW_TITLE;
let COINBASE_ROW_TEXT;
let TAOBAO_ROW_TITLE;
let TAOBAO_ROW_TEXT;
let SHAPESHIFT_ROW_TITLE;
let SHAPESHIFT_ROW_TEXT;
let FAUCET_ROW_TITLE;

function mapStateToProps(state) {
  return {
    network: state.irmeta.network,
    address: state.irmeta.selectedAddress,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toCoinbase: (address) => dispatch(actions.buyIrc({network: '1', address, amount: 0})),
    hideModal: () => dispatch(actions.hideModal()),
    hideWarning: () => dispatch(actions.hideWarning()),
    showAccountDetailModal: () => dispatch(actions.showModal({name: 'ACCOUNT_DETAILS'})),
    toFaucet: (network) => dispatch(actions.buyIrc({network})),
  };
}

inherits(DepositIrcerModal, Component);

function DepositIrcerModal(props, context) {
  Component.call(this);

  // need to set after i18n locale has loaded
  DIRECT_DEPOSIT_ROW_TITLE = context.t('directDepositIrcer');
  DIRECT_DEPOSIT_ROW_TEXT = context.t('directDepositIrcerExplainer');
  COINBASE_ROW_TITLE = context.t('buyCoinbase');
  COINBASE_ROW_TEXT = context.t('buyCoinbaseExplainer');
  TAOBAO_ROW_TITLE = context.t('buyTaobao');
  TAOBAO_ROW_TEXT = context.t('buyTaobaoExplainer');
  SHAPESHIFT_ROW_TITLE = context.t('depositShapeShift');
  SHAPESHIFT_ROW_TEXT = context.t('depositShapeShiftExplainer');
  FAUCET_ROW_TITLE = context.t('testFaucet');

  this.state = {
    buyingWithShapeshift: false,
  };
}

DepositIrcerModal.contextTypes = {
  t: PropTypes.func,
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(DepositIrcerModal);

DepositIrcerModal.prototype.facuetRowText = function(networkName) {
  return this.context.t('getIrcerFromFaucet', [networkName]);
};

DepositIrcerModal.prototype.renderRow = function({
  logo,
  title,
  text,
  buttonLabel,
  onButtonClick,
  hide,
  className,
  hideButton,
  hideTitle,
  onBackClick,
  showBackButton,
}) {
  if (hide) {
    return null;
  }

  return h('div', {
    className: className || 'deposit-ircer-modal__buy-row',
  }, [

    onBackClick && showBackButton && h(
      'div.deposit-ircer-modal__buy-row__back',
      {onClick: onBackClick},
      [h('i.fa.fa-arrow-left.cursor-pointer')],
    ),

    h('div.deposit-ircer-modal__buy-row__logo-container', [logo]),

    h('div.deposit-ircer-modal__buy-row__description', [
      !hideTitle && h('div.deposit-ircer-modal__buy-row__description__title', [title]),
      h('div.deposit-ircer-modal__buy-row__description__text', [text]),
    ]),

    !hideButton && h('div.deposit-ircer-modal__buy-row__button', [
      h('button.btn-primary.btn--large.deposit-ircer-modal__deposit-button', {
        onClick: onButtonClick,
      }, [buttonLabel]),
    ]),

  ]);
};

DepositIrcerModal.prototype.render = function() {
  const {network, toCoinbase, address, toFaucet} = this.props;
  const {buyingWithShapeshift} = this.state;
  const networkName = getNetworkDisplayName(network);

  return h('div.page-container.page-container--full-width.page-container--full-height', {}, [

    h('div.page-container__header', [
      h('div.page-container__title', [this.context.t('depositIrcer')]),
      h('div.page-container__subtitle', [this.context.t('needIrcerInWallet')]),
      h('div.page-container__header-close', {
        onClick: () => {
          this.setState({buyingWithShapeshift: false});
          this.props.hideWarning();
          this.props.hideModal();
        },
      }),
    ]),

    h(
      '.page-container__content', {
        style: {paddingBottom: '16px'},
      }, [
        h('div.deposit-ircer-modal__buy-rows', [

          this.renderRow({
            logo: h('img.deposit-ircer-modal__logo', {
              src: './images/deposit-irc.svg',
            }),
            title: DIRECT_DEPOSIT_ROW_TITLE,
            text: DIRECT_DEPOSIT_ROW_TEXT,
            buttonLabel: this.context.t('viewAccount'),
            onButtonClick: () => this.goToAccountDetailsModal(),
            hide: buyingWithShapeshift,
          }),

          this.renderRow({
            logo: h('div.deposit-ircer-modal__logo', {
              style: {
                backgroundImage: 'url(./images/logo.png)',
                height: '60px',
              },
            }),
            title: TAOBAO_ROW_TITLE,
            text: TAOBAO_ROW_TEXT,
            buttonLabel: this.context.t('getIrcer'),
            onButtonClick: () => toCoinbase(address),
          }),

          this.renderRow({
            logo: h('i.fa.fa-tint.fa-2x'),
            title: FAUCET_ROW_TITLE,
            text: this.facuetRowText(networkName),
            buttonLabel: this.context.t('getIrcer'),
            onButtonClick: () => toFaucet(network),
            hide: true,
          }),

          this.renderRow({
            logo: h('div.deposit-ircer-modal__logo', {
              style: {
                backgroundImage: 'url(./images/coinbase-logo.png)',
                height: '40px',
              },
            }),
            title: COINBASE_ROW_TITLE,
            text: COINBASE_ROW_TEXT,
            buttonLabel: this.context.t('continueToCoinbase'),
            onButtonClick: () => toCoinbase(address),
            hide: true,
          }),

          this.renderRow({
            logo: h('div.deposit-ircer-modal__logo', {
              style: {backgroundImage: 'url(./images/shapeshift-logo.png)'},
            }),
            title: SHAPESHIFT_ROW_TITLE,
            text: SHAPESHIFT_ROW_TEXT,
            buttonLabel: this.context.t('shapeshiftBuy'),
            onButtonClick: () => this.setState({buyingWithShapeshift: true}),
            hide: true,
            hideButton: buyingWithShapeshift,
            hideTitle: buyingWithShapeshift,
            onBackClick: () => this.setState({buyingWithShapeshift: false}),
            showBackButton: this.state.buyingWithShapeshift,
            className: buyingWithShapeshift && 'deposit-ircer-modal__buy-row__shapeshift-buy',
          }),

          buyingWithShapeshift && h(ShapeshiftForm),

        ]),

      ]),
  ]);
};

DepositIrcerModal.prototype.goToAccountDetailsModal = function() {
  this.props.hideWarning();
  this.props.hideModal();
  this.props.showAccountDetailModal();
};
