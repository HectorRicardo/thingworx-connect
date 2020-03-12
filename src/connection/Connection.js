import Utils from '../utilities';

// Cross compatibility with browser and Node.
const fetch = Utils.isNode ? require('node-fetch') : window.fetch.bind(window);

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
   * @param {Server} server - the Thingworx server for which to create a connection.
   * @param {object} modifyOptions - the options modifier of the connection. This is a callback
   * that when called with a request options object as parameter, modfies that options object so
   * that it contains the authentication parameters.
   */
  constructor(server, modifyOptions) {
    this.server = server;
    this.modifyOptions = modifyOptions;
    this.collectionProxies = this.createEntityCollectionProxies(this);
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
}
