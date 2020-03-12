import ImmutableConnection from './connection/ImmutableConnection';
import MutableConnection from './connection/MutableConnection';
import Utils from './utilities';

/**
 * Entry class of the library.
 */
export default class Thingworx {
  /**
   * Creates an immutable reference to entity collections in a particular Thingworx server.
   * An immutable reference to collections has its authentication parameters fixed: once you
   * retrieve the collections using certain authentication parameters, you cannot change them
   * later on (in contrast to a mutable reference).
   *
   * You can use object destructuring to access the collections. See examples below.
   *
   * Note: This method does not check the validity of the authentication parameters before making
   * the requests.
   *
   * @param {string} [serverOrigin] - the Thingworx server to connect to. Defaults to the empty
   * string, which in browsers, will be considered as the current origin (window.origin). If no
   * scheme (protocol) is in the origin url, then an 'http' protocol will be prepended by default.
   * @param {object} authParams - the parameters to use to authenticate to the Thingworx server
   * when doing the requests (Mandatory for Node, optional for browsers). If not given, the browser
   * will try to use credentials (cookies, authorization headers, or TLS certificates) for the HTTP
   * requests. This is the same as setting the credentials option to 'include' in the Requests.
   * @param {string} [authParams.appKey] - the appKey to use while making the REST API calls.
   * @param {string} [authParams.username] - the username to use to authenticate with Basic
   * authorization.
   * @param {string} [authParams.password] - the password to use to authenticate with Basic
   * authorization.
   *
   * Only one of the appKey or the combination of the username and password can be set. The other
   * one must forcefully be undefined, null, or not present in the authentication parameters object.
   * Prefer to use appKey or the browser credentials over username/password. Requests that use an
   * appKey as authentication method are much faster than those using Basic Authentication.
   *
   * If you are using this library in the browser and don't pass any parameters to this method at
   * all, as soon as the first REST API request is made, your browser will prompt you for your
   * credentials. If they're correct, a session cookie is generated that will allow you to
   * authenticate your next requests without re-entering your credentials.
   *
   * @returns {Proxy} references to all entity collections wrapped in an object. Use object
   * destructuring to access those references. See examples.
   *
   * @example
   * const { Things } = Thingworx.collections('http://localhost:8080');
   * @example
   * const { ThingShapes, Mashups } = Thingworx.collections('localhost', {
   *   appKey: '896548f2-eaab-46a4-b129-53f1531557a4',
   * });
   * @example
   * const { Resources, Networks } = Thingworx.collections('https://localhost:8080', {
   *   username: 'admin',
   *   password: 'myPassw0rd',
   * });
   */
  static collections(serverOrigin = '', authParams) {
    if (Utils.isNode && (authParams == null || Utils.isObjectEmpty(authParams))) {
      throw new Error('Authentication parameters are missing');
    }
    const connection = ImmutableConnection.getConnection(serverOrigin, authParams);
    return connection.collectionProxies;
  }

  /**
   * Creates an mutable reference to entity collections in a particular Thingworx server.
   * An mutable reference to collections has its authentication parameters fixed: once you retrieve
   * the collections using certain authentication parameters, you can change those parameters later
   * on by calling the .setAuthParams() method on the reference (in contrast to an immutable
   * reference).
   *
   * You can use object destructuring to access the collections. See examples below.
   *
   * Note: This method does not check the validity of the authentication parameters before making
   * the requests.
   *
   * @param {string} [serverOrigin] - the Thingworx server to connect to. Defaults to the empty
   * string, which in browsers, will be considered as the current origin (window.origin). If no
   * scheme (protocol) is in the origin url, then an 'http' protocol will be prepended by default.
   * @param {object} authParams - the parameters to use to authenticate to the Thingworx server
   * when doing the requests (Mandatory for Node, optional for browsers). If not given, the browser
   * will try to use credentials (cookies, authorization headers, or TLS certificates) for the HTTP
   * requests. This is the same as setting the credentials option to 'include' in the Requests.
   * @param {string} [authParams.appKey] - the appKey to use while making the REST API calls.
   * @param {string} [authParams.username] - the username to use to authenticate with Basic
   * authorization.
   * @param {string} [authParams.password] - the password to use to authenticate with Basic
   * authorization.
   *
   * Only one of the appKey or the combination of the username and password can be set. The other
   * one must forcefully be undefined, null, or not present in the authentication parameters object.
   * Prefer to use appKey or the browser credentials over username/password. Requests that use an
   * appKey as authentication method are much faster than those using Basic Authentication.
   *
   * If you are using this library in the browser and don't pass any parameters to this method at
   * all, as soon as the first REST API request is made, your browser will prompt you for your
   * credentials. If they're correct, a session cookie is generated that will allow you to
   * authenticate your next requests without re-entering your credentials.
   *
   * @returns {Proxy} references to all entity collections wrapped in an object. Use object
   * destructuring to access those references. See examples.
   *
   * @example
   * const { Things } = Thingworx.collections('http://localhost:8080');
   * @example
   * const { ThingShapes, Mashups } = Thingworx.collections('localhost', {
   *   appKey: '896548f2-eaab-46a4-b129-53f1531557a4',
   * });
   * @example
   * const { Resources, Networks } = Thingworx.collections('https://localhost:8080', {
   *   username: 'admin',
   *   password: 'myPassw0rd',
   * });
   */
  static mutableCollections(serverOrigin = '', authParams) {
    if (Utils.isNode && (authParams == null || Utils.isObjectEmpty(authParams))) {
      throw new Error('Authentication parameters are missing');
    }
    const connection = new MutableConnection(serverOrigin, authParams);
    return connection.collectionProxies;
  }
}
