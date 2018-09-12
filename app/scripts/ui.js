const injectCss = require('inject-css');
const NewIrMetaUiCss = require('../../ui/css');
const startPopup = require('./popup-core');
const PortStream = require('./lib/port-stream.js');
const {getEnvironmentType} = require('./lib/util');
const {ENVIRONMENT_TYPE_NOTIFICATION} = require('./lib/enums');
const extension = require('extensionizer');
const ExtensionPlatform = require('./platforms/extension');
const NotificationManager = require('./lib/notification-manager');
const notificationManager = new NotificationManager();
const setupRaven = require('./lib/setupRaven');
const log = require('loglevel');

start().catch(log.error);

async function start() {

  // create platform global
  global.platform = new ExtensionPlatform();

  // setup sentry error reporting
  const release = global.platform.getVersion();
  setupRaven({release});

  // inject css
  // const css = IrMetaUiCss()
  // injectCss(css)

  // identify window type (popup, notification)
  const windowType = getEnvironmentType(window.location.href);
  global.IRMETA_UI_TYPE = windowType;
  closePopupIfOpen(windowType);

  // setup stream to background
  const extensionPort = extension.runtime.connect({name: windowType});
  const connectionStream = new PortStream(extensionPort);

  // start ui
  const container = document.getElementById('app-content');
  startPopup({container, connectionStream}, (err) => {
    if (err) return displayCriticalError(err);
    injectCss(NewIrMetaUiCss());
  });


  function closePopupIfOpen(windowType) {
    if (windowType !== ENVIRONMENT_TYPE_NOTIFICATION) {
      // should close only chrome popup
      notificationManager.closePopup();
    }
  }

  function displayCriticalError(err) {
    container.innerHTML = '<div class="critical-error">The IrMeta app failed to load: please open and close IrMeta again to restart.</div>';
    container.style.height = '80px';
    log.error(err.stack);
    throw err;
  }

}
