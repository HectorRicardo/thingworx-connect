/**
 * This class does not extend the Request interface because the Request interface's properties are
 * read-only, and we still need to modify the options of the request in order to put the
 * authentication parameters. When calling .send(), the connection object will add the
 * authentication parameters, and for that, the options need to be modifiable.
 */
export default class RequestNeedingAuthentication {
  /**
   * Create a request that needs to be filled in with authentication parameters.
   *
   * @param {string} url - the complete URL this request will go to.
   * @param {object} options - the options for this request.
   * @param {Server} server - the instance of the server this request belongs to.
   */
  constructor(url, options, server) {
    if (!Object.isExtensible(options)) {
      throw new Error('Options of the request cannot be read-only, they need to be writable so the authentication parameters get added');
    }
    this.url = url;
    this.options = options;
    this.server = server;
  }
}
