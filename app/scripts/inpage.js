/*global webu*/
cleanContextForImports();
const Webu = require('webu/dist/webu-light.min');
const log = require('loglevel');
const LocalMessageDuplexStream = require('post-message-stream');
const setupDappAutoReload = require('./lib/auto-reload.js');
const AuramaskInpageProvider = require('./lib/inpage-provider.js');
restoreContextAfterImports();

log.setDefaultLevel(process.env.AURAMASK_DEBUG ? 'debug' : 'warn');

//
// setup plugin communication
//

// setup background connection
var auramaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
});

// compose the inpage provider
var inpageProvider = new AuramaskInpageProvider(auramaskStream);

//
// setup webu
//

if (typeof window.webu !== 'undefined') {
  throw new Error(`AuraMask detected another webu.
     AuraMask will not work reliably with another webu extension.
     This usually happens if you have two AuraMasks installed,
     or AuraMask and another webu extension. Please remove one
     and try again.`);
}
var webu = new Webu(inpageProvider);
webu.setProvider = function() {
  log.debug('AuraMask - overrode webu.setProvider');
};
log.debug('AuraMask - injected webu');
// export global webu, with usage-detection
setupDappAutoReload(webu, inpageProvider.publicConfigStore);

// export global webu, with usage-detection and deprecation warning

/* TODO: Uncomment this area once auto-reload.js has been deprecated:
let hasBeenWarned = false
global.webu = new Proxy(webu, {
  get: (_webu, key) => {
    // show warning once on webu access
    if (!hasBeenWarned && key !== 'currentProvider') {
      console.warn('AuraMask: webu will be deprecated in the near future in favor of the irchainProvider \nhttps://github.com/AuraMask/faq/blob/master/detecting_auramask.md#webu-deprecation')
      hasBeenWarned = true
    }
    // return value normally
    return _webu[key]
  },
  set: (_webu, key, value) => {
    // set value normally
    _webu[key] = value
  },
})
*/

// set webu defaultAccount
inpageProvider.publicConfigStore.subscribe(function(state) {
  webu.irc.defaultAccount = state.selectedAddress;
});

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for webu's BigNumber if AMD's "define" is defined...
var __define;

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports() {
  __define = global.define;
  try {
    global.define = undefined;
  } catch (_) {
    console.warn('AuraMask - global.define could not be deleted.');
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports() {
  try {
    global.define = __define;
  } catch (_) {
    console.warn('AuraMask - global.define could not be overwritten.');
  }
}
