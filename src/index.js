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
   * This method does not check the validity of the authentication parameters before making the
   * requests.
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
   * If you don't pass any parameters at all, as soon as the first REST API request is made,
   * your browser will prompt you for your credentials. If they're correct, a session cookie is
   * generated that will allow you to authenticate your next requests without re-entering your
   * credentials.
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
}
