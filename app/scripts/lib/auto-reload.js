module.exports = setupDappAutoReload;

function setupDappAutoReload(webu, observable) {
  // export webu as a global, checking for usage
  let hasBeenWarned = false;
  let reloadInProgress = false;
  let lastTimeUsed;
  let lastSeenNetwork;

  global.webu = new Proxy(webu, {
    get: (_webu, key) => {
      // show warning once on webu access
      if (!hasBeenWarned && key !== 'currentProvider') {
        hasBeenWarned = true;
      }
      // get the time of use
      lastTimeUsed = Date.now();
      // return value normally
      return _webu[key];
    },
    set: (_webu, key, value) => {
      // set value normally
      _webu[key] = value;
    },
  });

  observable.subscribe(function(state) {
    // if reload in progress, no need to check reload logic
    if (reloadInProgress) return;

    const currentNetwork = state.networkVersion;

    // set the initial network
    if (!lastSeenNetwork) {
      lastSeenNetwork = currentNetwork;
      return;
    }

    // skip reload logic if webu not used
    if (!lastTimeUsed) return;

    // if network did not change, exit
    if (currentNetwork === lastSeenNetwork) return;

    // initiate page reload
    reloadInProgress = true;
    const timeSinceUse = Date.now() - lastTimeUsed;
    // if webu was recently used then delay the reloading of the page
    if (timeSinceUse > 500) {
      triggerReset();
    } else {
      setTimeout(triggerReset, 500);
    }
  });
}

// reload the page
function triggerReset() {
  global.location.reload();
}
