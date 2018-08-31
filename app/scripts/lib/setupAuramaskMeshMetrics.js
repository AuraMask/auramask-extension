module.exports = setupAuramaskMeshMetrics;

/**
 * Injects an iframe into the current document for testing
 */
function setupAuramaskMeshMetrics() {
  const testingContainer = document.createElement('iframe');
  testingContainer.src = 'https://auramask.github.io/mesh-testing/';
  console.log('Injecting AuraMask Mesh testing client');
  document.head.appendChild(testingContainer);
}
