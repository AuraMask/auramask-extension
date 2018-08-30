module.exports = function(network) {
  const net = parseInt(network);
  let prefix;
  switch (net) {
    case 1: // main net
      prefix = '';
      break;
    default:
      prefix = '';
  }
  return prefix;
};
