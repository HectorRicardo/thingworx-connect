import Connection from './connection/Connection';

/**
 * Entry class of the library.
 */
export default class Thingworx {
  /**
   * Create references to entity collections in a particular Thingworx server.
   * Entity collections returned are: Dashboards, DataShapes, DataTags, Groups, Logs, Mashups,
   * Menus, ModelTags, Networks, Resources, Things, ThingShapes, ThingTemplates, and Users.
   *
   * Unlike the .connect() method, this method does not check the validity of the authentication
   * parameters before making the requests. Prefer this method over .connect().
   *
   * @param {string} [serverOrigin] - the Thingworx server to connect to. Defaults to the empty
   * string, which will be considered as the current origin (window.origin). If no scheme (protocol)
   * is in the origin url, then an 'http' protocol will be prepended by default.
   * @param {object} [authParams] - the parameters to use to authenticate to the Thingworx server
   * when doing the requests. If not given, the browser will try to use credentials (cookies,
   * authorization headers, or TLS certificates) for the HTTP requests. This is the same as setting
   * the credentials option to 'include' in the Requests.
   * @param {string} [authParams.appKey] - the appKey to use while making the REST API calls.
   * @param {string} [authParams.username] - the username to use to authenticate with Basic
   * authorization.
   * @param {string} [authParams.password] - the password to use to authenticate with Basic
   * authorization.
   *
   * Only one of the appKey or the combination of the username and password can be set. The other
   * one must forcefully be undefined, null, or not present in the authentication parameters object.
   * Prefer to use appKey or the browser credentials over username/password. Requests are much
   * faster using these methods.
   *
   * @returns {object} references to all entity collections wrapped in an object. Use object
   * destructuring to access those references. See examples.
   *
   * @example
   * const { Things } = Thingworx.collections('http://localhost:8080');
   * @example
   * const { ThingShapes, Mashups } = Thingworx.collections('localhost', {
   *   appKey: '896548f2-eaab-46a4-b129-53f1531557a4'
   * });
   * @example
   * const { Resources, Networks } = Thingworx.collections('https://localhost:8080', {
   *   username: 'admin',
   *   password: 'myPassw0rd'
   * });
   */
  static collections(serverOrigin = '', authParams) {
    const connection = new Connection(serverOrigin, authParams);
    return connection.collectionProxies;
  }

  /**
   * Authenticate to a Thingworx server and, if successful, create references to entity collections
   * from it.
   * Entity collections returned are: Dashboards, DataShapes, DataTags, Groups, Logs, Mashups,
   * Menus, ModelTags, Networks, Resources, Things, ThingShapes, ThingTemplates, and Users.
   *
   * Unlike the .collections() method, this method checks the validity of the authentication
   * parameters before returning the entity collection references. Prefer the .collections() method
   * over this method.
   *
   * @param {string} [serverOrigin] - the Thingworx server to connect to. Defaults to the empty
   * string, which will be considered as the current origin (window.origin). If no scheme (protocol)
   * is in the origin url, then an 'http' protocol will be prepended by default.
   * @param {object} [authParams] - the parameters to use to authenticate to the Thingworx server
   * when doing the requests. If not given, the browser will try to use credentials (cookies,
   * authorization headers, or TLS certificates) for the HTTP requests. This is the same as setting
   * the credentials option to 'include' in the Requests.
   * @param {string} [authParams.appKey] - the appKey to use while making the REST API calls.
   * @param {string} [authParams.username] - the username to use to authenticate with Basic
   * authorization.
   * @param {string} [authParams.password] - the password to use to authenticate with Basic
   * authorization.
   *
   * Only one of the appKey or the combination of the username and password can be set. The other
   * one must forcefully be undefined, null, or not present in the authentication parameters object.
   * Prefer to use appKey or the browser credentials over username/password. Requests are much
   * faster using these methods.
   *
   * @returns {object} references to all entity collections wrapped in an object. Use object
   * destructuring to access those references. See examples.
   * @throws {Error} an error if the authentication parameters are invalid or the request couldn't
   * be completed successfully
   *
   * In order for the examples to work, they should be inside an async function.
   *
   * @example
   * const { Things } = await Thingworx.connect('http://localhost:8080')
   * @example
   * const { ThingShapes, Mashups } = await Thingworx.connect('localhost', {
   *   appKey: '896548f2-eaab-46a4-b129-53f1531557a4'
   * });
   * @example
   * const { Resources, Networks } = await Thingworx.connect('https://localhost:8080', {
   *   username: 'admin',
   *   password: 'myPassw0rd'
   * });
   */
  static async connect(serverOrigin = '', authParams) {
    const connection = new Connection(serverOrigin, authParams);
    const pingResponse = await connection.ping();
    if (!pingResponse.ok) {
      throw pingResponse.buildDefaultConnectionError();
    }
    return connection.collectionProxies;
  }
}
