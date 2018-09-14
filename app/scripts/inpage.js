/*global webu*/
cleanContextForImports();
const Webu = require('webu');
const log = require('loglevel');
const LocalMessageDuplexStream = require('post-message-stream');
const setupDappAutoReload = require('./lib/auto-reload.js');
const IrmetaInpageProvider = require('./lib/inpage-provider.js');
restoreContextAfterImports();

const irmetaStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
});

const inpageProvider = new IrmetaInpageProvider(irmetaStream);
if (typeof window.webu !== 'undefined') {
  throw new Error(`IrMeta detected another webu.
     IrMeta will not work reliably with another webu extension.
     This usually happens if you have two IrMetas installed,
     or IrMeta and another webu extension. Please remove one
     and try again.`);
}
const webu = new Webu(inpageProvider);
webu.setProvider = () => log.debug('IrMeta - overrode webu.setProvider');
log.debug('IrMeta - injected webu');
setupDappAutoReload(webu, inpageProvider.publicConfigStore);
// set webu defaultAccount
inpageProvider.publicConfigStore.subscribe(function(state) {
  webu.irc.defaultAccount = state.selectedAddress;
});


/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 */
let __define;
function cleanContextForImports() {
  __define = global.define;
  try {
    global.define = undefined;
  } catch (_) {
    console.warn('IrMeta - global.define could not be deleted.');
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports() {
  try {
    global.define = __define;
  } catch (_) {
    console.warn('IrMeta - global.define could not be overwritten.');
  }
}
