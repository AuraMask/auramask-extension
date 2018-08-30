const version = 3;
const newTestRpc = 'http://localhost:8545/';

const clone = require('clone');

module.exports = {
  version,

  migrate: function(originalVersionedData) {
    const versionedData = clone(originalVersionedData);
    versionedData.meta.version = version;
    try {
      versionedData.data.config.provider.rpcTarget = newTestRpc;
    } catch (e) {}
    return Promise.resolve(versionedData);
  },
};
