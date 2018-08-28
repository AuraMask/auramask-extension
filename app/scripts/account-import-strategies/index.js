const Wallet = require('icjs-wallet');
const importers = require('icjs-wallet/thirdparty');
const ircUtil = require('icjs-util');

const accountImporter = {

  importAccount(strategy, args) {
    try {
      const importer = this.strategies[strategy];
      const privateKeyHex = importer.apply(null, args);
      return Promise.resolve(privateKeyHex);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  strategies: {
    'Private Key': (privateKey) => ircUtil.stripHexPrefix(privateKey),
    'JSON File': (input, password) => {
      let wallet;
      try {
        wallet = importers.fromEtherWallet(input, password);
      } catch (e) {
        console.log('Attempt to import as EtherWallet format failed, trying V3...');
      }

      if (!wallet) {
        wallet = Wallet.fromV3(input, password, true);
      }

      return walletToPrivateKey(wallet);
    },
  },

};

function walletToPrivateKey(wallet) {
  const privateKeyBuffer = wallet.getPrivateKey();
  return ircUtil.bufferToHex(privateKeyBuffer);
}

module.exports = accountImporter;
