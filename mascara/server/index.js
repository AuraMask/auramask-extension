const path = require('path');
const express = require('express');
const compression = require('compression');

module.exports = createAuramascaraServer;

function createAuramascaraServer() {

  // setup server
  const server = express();
  server.use(compression());

  // serve assets
  server.use(express.static(path.join(__dirname, '/../ui/index'), {setHeaders: (res) => res.set('X-Frame-Options', 'DENY')}));
  server.use(express.static(path.join(__dirname, '/../../dist/mascara')));
  server.use(express.static(path.join(__dirname, '/../proxy')));

  return server;

}
