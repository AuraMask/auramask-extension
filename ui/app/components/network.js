const Component = require('react').Component;
const PropTypes = require('prop-types');
const h = require('react-hyperscript');
const connect = require('react-redux').connect;
const classnames = require('classnames');
const inherits = require('util').inherits;
const NetworkDropdownIcon = require('./dropdowns/components/network-dropdown-icon');

Network.contextTypes = {
  t: PropTypes.func,
};

module.exports = connect()(Network);

inherits(Network, Component);

function Network() {
  Component.call(this);
}

Network.prototype.render = function() {
  const props = this.props;
  const context = this.context;
  const network = props.network;
  const providerName = props.provider ? props.provider.type : null;
  let iconName, hoverText;

  if (network === 'loading') {
    return h('span.pointer.network-indicator', {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
      },
      onClick: (event) => this.props.onClick(event),
    }, [
      h('img', {
        title: context.t('attemptingConnect'),
        style: {width: '27px'},
        src: 'images/loading.svg',
      }),
    ]);
  } else if (providerName === 'mainnet') {
    hoverText = context.t('mainnet');
    iconName = 'irchain-network';
  } else {
    hoverText = context.t('unknownNetwork');
    iconName = 'unknown-private-network';
  }

  return h('div.network-component.pointer', {
    className: classnames({
      'network-component--disabled': this.props.disabled,
      'irchain-network': providerName === 'mainnet',
    }),
    title: hoverText,
    onClick: (event) => {
      if (!this.props.disabled) {
        this.props.onClick(event);
      }
    },
  }, [
    iconName === 'irchain-network'
      ? h('.network-indicator', [
        h(NetworkDropdownIcon, {
          backgroundColor: '#038789',
          nonSelectBackgroundColor: '#15afb2',
        }),
        h('.network-name', context.t('mainnet')),
        h('i.fa.fa-chevron-down.fa-lg.network-caret')])
      : h('.network-indicator', [
        h('i.fa.fa-question-circle.fa-lg', {
          style: {margin: '10px', color: '#d13c43'},
        }),
        h('.network-name', context.t('privateNetwork')),
        h('i.fa.fa-chevron-down.fa-lg.network-caret'),
      ]),
  ]);
};
