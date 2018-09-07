const ircUtil = (/** @type {object} */ (require('icjs-util')));
const BN = ircUtil.BN;

/**
 * Returns a [BinaryNumber]{@link BN} representation of the given hex value
 * @param {string} hex
 * @return {any}
 */
module.exports = function hexToBn(hex) {
  return new BN(ircUtil.stripHexPrefix(hex), 16);
};

