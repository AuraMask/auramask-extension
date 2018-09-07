const ircJsRpcSlug = 'Error: rpc error with payload ';
const errorLabelPrefix = 'Error: ';

module.exports = extractIrcjsErrorMessage;

/**
 * Extracts the important part of an ircjs-rpc error message. If the passed error is not an isIrcjsRpcError, the error
 * is returned unchanged.
 *
 * @param {string} errorMessage The error message to parse
 * @returns {string} Returns an error message, either the same as was passed, or the ending message portion of an isIrcjsRpcError
 *
 */
function extractIrcjsErrorMessage(errorMessage) {
  const isIrcjsRpcError = errorMessage.includes(ircJsRpcSlug);
  if (isIrcjsRpcError) {
    const payloadAndError = errorMessage.slice(ircJsRpcSlug.length);
    return payloadAndError.slice(payloadAndError.indexOf(errorLabelPrefix) + errorLabelPrefix.length);
  } else {
    return errorMessage;
  }
}
