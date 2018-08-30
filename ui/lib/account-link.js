module.exports = function(address, network) {
  const net = parseInt(network);
  let link;
  switch (net) {
    case 1: // main net
      link = `https://scan.irchain.io/address/${address}`;
      break;
    default:
      link = '';
      break;
  }

  return link;
};
