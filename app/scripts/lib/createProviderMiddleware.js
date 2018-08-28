module.exports = createProviderMiddleware;

/**
 * Forwards an HTTP request to the current webu provider
 *
 * @param {{ provider: Object }} config Configuration containing current webu provider
 */
function createProviderMiddleware({provider}) {
  return (req, res, next, end) => {
    provider.sendAsync(req, (err, _res) => {
      if (err) return end(err);
      res.result = _res.result;
      end();
    });
  };
}
