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
export default class ImmutableConnection extends Connection {
  /**
   * Creates a proxy for accessing the entity collections of the connection's server.
   * The proxy is immutable (that is, once created, you cannot change its authentication
   * parameters).
   *
   * @returns {Proxy} a proxy representing the entity collections of the connection's server.
   */
  createEntityCollectionProxies() {
    return ProxyCreator.createImmutableEntityCollectionProxies(this);
  }

  /**
   * Retrieves a new connection to a particular Thingworx server.
   * If the connection was already created before, retrieves that connection instead of creating a
   * new one. Otherwise, creates a new connection and stores it in a cache, so when calling this
   * service again with the same parameters, that connection is returned instead of a new one.
   *
   * @param {string|Server} server - the Thingworx server for which to create a connection.
   * @param {object} authParams - the authentication parameters used to authenticate to the
   * Thingworx server. See the documentation of Thingworx.collections() or Thingworx.connect() for
   * details of these parameters.
   * @returns {Connection} - the connection object associated to the given parameters.
   */
  static getConnection(server, authParams) {
    let serverInstance;
    if (typeof server === 'string') {
      serverInstance = Server.getServer(server);
    } else if (server.constructor.name === 'Server') {
      serverInstance = server;
    } else {
      throw new Error('Server parameter should be either a string or an instance of the Server class.');
    }
    const optionsModifier = OptionsModifier.getModifier(authParams);

    if (!ImmutableConnection.cache.has(serverInstance)) {
      ImmutableConnection.cache.set(serverInstance, new Map());
    }
    const optionsModifiersMap = ImmutableConnection.cache.get(serverInstance);

    if (!optionsModifiersMap.has(optionsModifier)) {
      const connection = new ImmutableConnection(serverInstance, optionsModifier);
      optionsModifiersMap.set(optionsModifier, connection);
    }

    return optionsModifiersMap.get(optionsModifier);
  }
}

ImmutableConnection.cache = new Map();
