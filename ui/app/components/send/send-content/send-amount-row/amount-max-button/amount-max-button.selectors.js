const selectors = {
  getMaxModeOn,
};

module.exports = selectors;

function getMaxModeOn(state) {
  return state.irmeta.send.maxModeOn;
}
