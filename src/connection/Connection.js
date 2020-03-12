import Server from './Server';
import ProxyCreator from './ProxyCreator';
import OptionsModifier from './OptionsModifier';

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
const fetch = isNode ? require('node-fetch') : window.fetch;

/**
 * Class used to create a connection to a particular Thingworx server.
 * A connection is defined by a Server and authentication parameters to that server.
 * Once a connection is created, you can use its collection proxies (located on the
 * collectionProxies property) to call Thingworx services.
 */
export default class Connection {
  /**
   * Creates a new connection to a particular Thingworx server.
   *
   * @param {string|Server} server - the Thingworx server for which to create a connection.
   * @param {object} authParams - the authentication parameters used to authenticate to the
   * Thingworx server. See the documentation of Thingworx.collections() or Thingworx.connect() for
   * details of these parameters.
   */
  constructor(server, authParams) {
    if (typeof server === 'string') {
      this.server = Server.getServer(server);
    } else if (server.constructor.name === 'Server') {
      this.server = server;
    } else {
      throw new Error('Server parameter should be either a string or an instance of the Server class.');
    }
    this.modifyOptions = OptionsModifier.getModifier(authParams);
    this.collectionProxies = ProxyCreator.createEntityCollectionProxies(this);
  }

  /**
   * Sends a request to the Thingworx server, modifying it to make sure it contains the correct
   * authorization parameters.
   *
   * @param {RequestNeedingAuthentication} request - the request to send to the Thingworx server.
   * This request is missing authentication parameters.
   * @returns {Promise} - a promise resulting from the fetch operation.
   */
  async sendRequest(request) {
    if (request.options == null) {
      request.options = {};
    }
    this.modifyOptions(request.options);
    return fetch(request.url, request.options);
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
