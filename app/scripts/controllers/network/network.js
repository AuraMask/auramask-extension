const assert = require('assert');
const EventEmitter = require('events');
const createIrmetaProvider = require('webu-provider-engine/zero.js');
const SubproviderFromProvider = require('webu-provider-engine/subproviders/provider.js');
const createInfuraProvider = require('irc-json-rpc-infura/src/createProvider');
const ObservableStore = require('obs-store');
const ComposedStore = require('obs-store/lib/composed');
const extend = require('xtend');
const IrcQuery = require('irc-query');
const createEventEmitterProxy = require('../../lib/events-proxy.js');
const log = require('loglevel');
const urlUtil = require('url');
const {
  MAINNET,
  LOCALHOST,
  LOCALHOST_RPC_URL,
} = require('./enums');
const INFURA_PROVIDER_TYPES = [MAINNET];

const env = process.env.IRMETA_ENV;
const IRMETA_DEBUG = process.env.IRMETA_DEBUG;
const testMode = (IRMETA_DEBUG || env === 'test');

const defaultProviderConfig = {
  type: testMode ? LOCALHOST : MAINNET,
};

module.exports = class NetworkController extends EventEmitter {

  constructor(opts = {}) {
    super();

    // parse options
    const providerConfig = opts.provider || defaultProviderConfig;
    // create stores
    this.providerStore = new ObservableStore(providerConfig);
    this.networkStore = new ObservableStore('loading');
    this.store = new ComposedStore({provider: this.providerStore, network: this.networkStore});
    // create event emitter proxy
    this._proxy = createEventEmitterProxy();

    this.on('networkDidChange', this.lookupNetwork);
  }

  initializeProvider(_providerParams) {
    this._baseProviderParams = _providerParams;
    const {type, rpcTarget} = this.providerStore.getState();
    this._configureProvider({type, rpcTarget});
    this._proxy.on('block', this._logBlock.bind(this));
    this._proxy.on('error', this.verifyNetwork.bind(this));
    this.ircQuery = new IrcQuery(this._proxy);
    this.lookupNetwork();
    return this._proxy;
  }

  verifyNetwork() {
    // Check network when restoring connectivity:
    if (this.isNetworkLoading()) this.lookupNetwork();
  }

  getNetworkState() {
    return this.networkStore.getState();
  }

  setNetworkState(network) {
    return this.networkStore.putState(network);
  }

  isNetworkLoading() {
    return this.getNetworkState() === 'loading';
  }

  lookupNetwork() {
    // Prevent firing when provider is not defined.
    if (!this.ircQuery || !this.ircQuery.sendAsync) {
      return log.warn('NetworkController - lookupNetwork aborted due to missing ircQuery');
    }
    this.ircQuery.sendAsync({method: 'net_version'}, (err, network) => {
      if (err) return this.setNetworkState('loading');
      log.info('webu.getNetwork returned ' + network);
      this.setNetworkState(network);
    });
  }

  setRpcTarget(rpcTarget) {
    this.providerConfig = {
      type: 'rpc',
      rpcTarget,
    };
  }

  async setProviderType(type) {
    assert.notStrictEqual(type, 'rpc', `NetworkController - cannot call "setProviderType" with type 'rpc'. use "setRpcTarget"`);
    assert(INFURA_PROVIDER_TYPES.includes(type) || type === LOCALHOST, `NetworkController - Unknown rpc type "${type}"`);
    this.providerConfig = {type};
  }

  resetConnection() {
    this.providerConfig = this.getProviderConfig();
  }

  set providerConfig(providerConfig) {
    this.providerStore.updateState(providerConfig);
    this._switchNetwork(providerConfig);
  }

  getProviderConfig() {
    return this.providerStore.getState();
  }

  // Private

  _switchNetwork(opts) {
    this.setNetworkState('loading');
    this._configureProvider(opts);
    this.emit('networkDidChange');
  }

  _configureProvider(opts) {
    const {type, rpcTarget} = opts;
    // infura type-based endpoints
    const isInfura = INFURA_PROVIDER_TYPES.includes(type);
    if (isInfura) {
      this._configureInfuraProvider(opts);
      // other type-based rpc endpoints
    } else if (type === LOCALHOST) {
      this._configureStandardProvider({rpcUrl: LOCALHOST_RPC_URL});
      // url-based rpc endpoints
    } else if (type === 'rpc') {
      this._configureStandardProvider({rpcUrl: rpcTarget});
    } else {
      throw new Error(`NetworkController - _configureProvider - unknown type "${type}"`);
    }
  }

  _configureInfuraProvider({type}) {
    log.info('_configureInfuraProvider', type);
    const infuraProvider = createInfuraProvider({network: type});
    const infuraSubprovider = new SubproviderFromProvider(infuraProvider);
    const providerParams = extend(this._baseProviderParams, {
      engineParams: {
        pollingInterval: 8000,
        blockTrackerProvider: infuraProvider,
      },
      dataSubprovider: infuraSubprovider,
    });
    const provider = createIrmetaProvider(providerParams);
    this._setProvider(provider);
  }

  _configureStandardProvider({rpcUrl}) {
    // urlUtil handles malformed urls
    rpcUrl = urlUtil.parse(rpcUrl).format();
    const providerParams = extend(this._baseProviderParams, {
      rpcUrl,
      engineParams: {
        pollingInterval: 8000,
      },
    });
    const provider = createIrmetaProvider(providerParams);
    this._setProvider(provider);
  }

  _setProvider(provider) {
    // collect old block tracker events
    const oldProvider = this._provider;
    let blockTrackerHandlers;
    if (oldProvider) {
      // capture old block handlers
      blockTrackerHandlers = oldProvider._blockTracker.proxyEventHandlers;
      // tear down
      oldProvider.removeAllListeners();
      oldProvider.stop();
    }
    // override block tracler
    provider._blockTracker = createEventEmitterProxy(provider._blockTracker, blockTrackerHandlers);
    // set as new provider
    this._provider = provider;
    this._proxy.setTarget(provider);
  }

  _logBlock(block) {
    log.info(`BLOCK CHANGED: #${block.number.toString('hex')} 0x${block.hash.toString('hex')}`);
    this.verifyNetwork();
  }
};
