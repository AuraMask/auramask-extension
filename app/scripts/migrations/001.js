const version = 1;

const clone = require('clone');

module.exports = {
  version,

  migrate: async function(originalVersionedData) {
    const versionedData = clone(originalVersionedData);
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  },
};

function transformState(state) {
  const newState = state;

  if (newState.PreferencesController) {
    if (newState.PreferencesController.tokens && newState.PreferencesController.identities) {
      const identities = newState.PreferencesController.identities;
      const tokens = newState.PreferencesController.tokens;
      newState.PreferencesController.accountTokens = {};
      for (const identity in identities) {
        newState.PreferencesController.accountTokens[identity] = {'mainnet': tokens};
      }
      newState.PreferencesController.tokens = [];
    }
  }

  return newState;
}
