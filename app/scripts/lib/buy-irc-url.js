module.exports = getBuyIrcUrl;

/**
 * Gives the caller a url at which the user can acquire irc, depending on the network they are in
 *
 * @param {object} opts Options required to determine the correct url
 * @param {string} opts.network The network for which to return a url
 * @param {string} opts.amount The amount of IRC to buy on coinbase. Only relevant if network === '1'.
 * @param {string} opts.address The address the bought IRC should be sent to.  Only relevant if network === '1'.
 * @returns {string|undefined} The url at which the user can access IRC, while in the given network. If the passed
 * network does not match any of the specified cases, or if no network is given, returns undefined.
 *
 */
function getBuyIrcUrl({network, address, amount}) {
  let url;
  switch (network) {
    case '1':
      url = `https://shop329523734.taobao.com/`;
      break;
  }
  return url;
}
