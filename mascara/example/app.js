const IrcQuery = require('irc.js').Query;

window.addEventListener('load', loadProvider);
window.addEventListener('message', console.warn);

async function loadProvider() {
  const irchainProvider = window.auramask.createDefaultProvider({host: 'http://localhost:9001'});
  const ircQuery = new IrcQuery(irchainProvider);
  const accounts = await ircQuery.accounts();
  window.AURAMASK_ACCOUNT = accounts[0] || 'locked';
  logToDom(accounts.length ? accounts[0] : 'LOCKED or undefined', 'account');
  setupButtons(ircQuery);
}

function logToDom(message, context) {
  document.getElementById(context).innerText = message;
  console.log(message);
}

function setupButtons(ircQuery) {
  const accountButton = document.getElementById('action-button-1');
  accountButton.addEventListener('click', async() => {
    const accounts = await ircQuery.accounts();
    window.AURAMASK_ACCOUNT = accounts[0] || 'locked';
    logToDom(accounts.length ? accounts[0] : 'LOCKED or undefined', 'account');
  });
  const txButton = document.getElementById('action-button-2');
  txButton.addEventListener('click', async() => {
    if (!window.AURAMASK_ACCOUNT || window.AURAMASK_ACCOUNT === 'locked') return;
    const txHash = await ircQuery.sendTransaction({
      from: window.AURAMASK_ACCOUNT,
      to: window.AURAMASK_ACCOUNT,
      data: '',
    });
    logToDom(txHash, 'cb-value');
  });
}
