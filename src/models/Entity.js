import Property from './Property';
import Service from './Service';

/**
 * Class representing an entity in ThingWorx.
 */
export default class Entity {
  /**
   * Creates a reference to an entity in a Thingworx server.
   *
   * @param {string} name - the name of the entity.
   * @param {EntityCollection} collection - the collection to which this entity belongs.
   */
  constructor(name, collection) {
    this.name = name;
    this.collection = collection;
    this.properties = new Map();
    this.services = new Map();
  }

  /**
   * Gets the reference to a property in the entity.
   * If it doesn't exist yet, adds it to the entity's list of properties and then returns it.
   *
   * @param {string} propertyName - the name of the property.
   * @returns {Property} the property object.
   */
  getProperty(propertyName) {
    if (!this.properties.has(propertyName)) {
      this.properties.set(propertyName, new Property(propertyName, this));
    }
    return this.properties.get(propertyName);
  }

  /**
   * Gets the reference to a service in the entity.
   * If it doesn't exist yet, adds it to the entity's list of services and then returns it.
   *
   * @param {string} serviceName - the name of the service.
   * @returns {Service} the service object.
   */
  getService(serviceName) {
    if (!this.services.has(serviceName)) {
      this.services.set(serviceName, new Service(serviceName, this));
    }
    return this.services.get(serviceName);
  }

  /**
   * Builds a string representation of the entity.
   *
   * @returns {string} - a string representation of the entiy.
   */
  toString() {
    return `${this.collection.name}['${this.name}']`;
  }
}
