const extend = require('xtend');
const actions = require('../actions');

module.exports = reduceIrmeta;

function reduceIrmeta(state, action) {
  const localeMessagesState = extend({}, state.localeMessages);

  switch (action.type) {
    case actions.SET_LOCALE_MESSAGES:
      return extend(localeMessagesState, {
        current: action.value,
      });
    default:
      return localeMessagesState;
  }
}
