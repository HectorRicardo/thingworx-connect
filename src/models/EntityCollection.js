/**
 * Class representing an entity collection.
 */
export default class EntityCollection {
  /**
   * Creates an entity collection.
   *
   * @param {string} name - the name of the collection.
   * @param {Function} collectionClass - the class of a single entity of the collection.
   * @param {Server} server - the server to which this collection belongs.
   */
  constructor(name, collectionClass, server) {
    this.name = name;
    this.CollectionClass = collectionClass;
    this.server = server;
    this.entities = new Map();
  }

  /**
   * Retrieves the reference to an entity from the collection.
   * If the reference hasn't been retrieved before, adds it to the collection and then returns it.
   *
   * @param {string} name - the name of the entity.
   * @returns {Entity} the entity object.
   */
  getEntity(name) {
    if (!this.entities.has(name)) {
      this.entities.set(name, new this.CollectionClass(name, this));
    }
    return this.entities.get(name);
  }
}
