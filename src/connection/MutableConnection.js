import Connection from './Connection';
import OptionsModifier from './OptionsModifier';
import ProxyCreator from './ProxyCreator';
import Server from './Server';

/**
 * Class used to create a connection to a particular Thingworx server.
 * A connection is defined by a Server and authentication parameters to that server.
 * Once a connection is created, you can use its collection proxies (located on the
 * collectionProxies property) to call Thingworx services.
 */
export default class MutableConnection extends Connection {
  /**
   * Creates a new connection to a particular Thingworx server.
   *
   * @param {string|Server} server - the Thingworx server for which to create a connection.
   * @param {object} authParams - the authentication parameters used to authenticate to the
   * Thingworx server. See the documentation of Thingworx.collections() or Thingworx.connect() for
   * details of these parameters.
   */
  constructor(server, authParams) {
    let serverInstance;
    if (typeof server === 'string') {
      serverInstance = Server.getServer(server);
    } else if (server.constructor.name === 'Server') {
      serverInstance = server;
    } else {
      throw new Error('Server parameter should be either a string or an instance of the Server class.');
    }
    const modifyOptions = OptionsModifier.getModifier(authParams);
    super(serverInstance, modifyOptions);
  }

  /**
   * Creates a proxy for accessing the entity collections of the connection's server.
   * The proxy is mutable (that is, once created, you are able to change its authentication
   * parameters later on).
   *
   * @returns {Proxy} a proxy representing the entity collections of the connection's server.
   */
  createEntityCollectionProxies() {
    return ProxyCreator.createMutableEntityCollectionProxies(this);
  }

  /**
   * Sets new authentication parameters with which to make requests.
   *
   * @param {object} authParams - the new authentication parameters used to communicate to the
   * Thingworx server. See the documentation of Thingworx.collections() or Thingworx.connect() for
   * details of these parameters.
   */
  setAuthParams(authParams) {
    this.modifyOptions = OptionsModifier.getModifier(authParams);
  }
}
