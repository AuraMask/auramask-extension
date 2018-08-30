module.exports = function(network) {
  const net = parseInt(network);
  let prefix;
  switch (net) {
    case 1: // main net
      prefix = '';
      break;
    case 3:
      prefix = 'localhost.';
      break;
    case 4:
      prefix = 'localhost.';
      break;
    case 42:
      prefix = 'localhost.';
      break;
    default:
      prefix = '';
  }
  return prefix;
};
