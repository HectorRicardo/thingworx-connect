import EntityCollection from '../models/EntityCollection';

/**
 * Class representing a Thingworx server.
 * Use the .getService() method instead of the constructor for creating instances of this class.
 */
export default class Server {
  /**
   * Creates a reference to a Thingworx server.
   * Precondition: the server origin should already have been cleaned using the static method
   * cleanServerOrigin of this class.
   * Do not call this directly. Use the static method .getService() of this class instead.
   *
   * @param {string} origin - the server origin.
   */
  constructor(origin) {
    this.origin = origin;
    this.collections = {};
  }

  /**
   * Returns an entity collection from the server.
   *
   * @param {string} name - the name of the collection
   * @returns {EntityCollection} - the entity collection.
   */
  getEntityCollection(name) {
    if (!Object.prototype.hasOwnProperty.call(this.collections, name)) {
      this.collections[name] = new EntityCollection(name, this);
    }
    return this.collections[name];
  }

  /**
   * Creates a reference to a Thingworx server or, if a reference to that server was already
   * created, returns that one instead of creating a new one.
   * Prefer calling this method in place of the constructor.
   *
   * @param {string} serverOrigin - the server origin.
   * @returns {Server} - an instance of Server associated to the given server origin.
   */
  static getServer(serverOrigin) {
    const { cache } = Server;
    const cleanedServerOrigin = Server.cleanServerOrigin(serverOrigin);
    if (!cache.has(cleanedServerOrigin)) {
      cache.set(cleanedServerOrigin, new Server(cleanedServerOrigin));
    }
    return cache.get(cleanedServerOrigin);
  }

  /**
   * Cleans server origin by adding the http scheme (if no scheme is present) and removing the
   * trailing slash (if present).
   * The empty string is not cleaned, it is returned as it is.
   *
   * @param {string} serverOrigin - the server origin.
   * @returns {string} the cleaned server origin.
   */
  static cleanServerOrigin(serverOrigin) {
    if (serverOrigin === '') return serverOrigin;

    const serverOriginWithScheme = serverOrigin.includes('://') ? serverOrigin : `http://${serverOrigin}`;
    return serverOriginWithScheme.replace(/\/$/, '');
  }
}

/**
 * Used for caching server instances. This avoids creating new instances that point to the same
 * server.
 */
Server.cache = new Map();
