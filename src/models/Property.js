import PropertyGetRequest from '../rest/requests/PropertyGetRequest';
import PropertySetRequest from '../rest/requests/PropertySetRequest';

/**
 * Class representing a reference to a property in a Thingworx entity.
 */
export default class Property {
  /**
   * Creates a reference to a property in a Thingworx entity.
   *
   * @param {string} name - the name of the property.
   * @param {Entity} entity - the entity to which the property belongs.
   */
  constructor(name, entity) {
    this.name = name;
    this.entity = entity;
  }

  /**
   * Executes a PropertyGetRequest and returns the response.
   *
   * @param {Connection} connection - the connection object to use for the request.
   * @returns {PropertyGetPromise} - an instance of PropertyGetPromise.
   */
  get(connection) {
    const request = new PropertyGetRequest(this);
    return request.send(connection);
  }

  /**
   * Sets the property value by making an HTTP request to the Thingworx server.
   *
   * @param {*} value - the new value of the property.
   * @param {Connection} connection - the connection object to use for the request.
   * @returns {PropertySetResponse} - an instance of PropertySetResponse.
   */
  async set(value, connection) {
    const request = new PropertySetRequest(this, value);
    return request.send(connection);
  }

  /**
   * Builds a string representation of the property.
   *
   * @returns {string} - a string representation of the property.
   */
  toString() {
    return `${this.entity.toString()}.${this.name}`;
  }
}
