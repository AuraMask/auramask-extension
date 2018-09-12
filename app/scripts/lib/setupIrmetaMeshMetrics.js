module.exports = setupIrmetaMeshMetrics;

/**
 * Injects an iframe into the current document for testing
 */
function setupIrmetaMeshMetrics() {
  const testingContainer = document.createElement('iframe');
  testingContainer.src = 'https://irmeta.github.io/mesh-testing/';
  console.log('Injecting IrMeta Mesh testing client');
  document.head.appendChild(testingContainer);
}
