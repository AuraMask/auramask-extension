// next version number
const version = 0;

/*

description of migration and what it does

*/

const clone = require('clone');

module.exports = {
  version,

  migrate: async function(originalVersionedData) {
    const versionedData = clone(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    versionedData.data = transformState(state);
    return versionedData;
  },
};

function transformState(state) {
  // transform state here
  return state;
}
