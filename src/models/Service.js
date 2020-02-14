import ServiceExecutionRequest from '../rest/requests/ServiceExecutionRequest';

/**
 * Class representing a reference to a service in a ThingWorx entity.
 */
export default class Service {
  /**
   * Creates a reference to a service in a Thingworx entity.
   *
   * @param {string} name - the name of the service.
   * @param {Entity} entity - the entity to which the service belongs.
   */
  constructor(name, entity) {
    this.name = name;
    this.entity = entity;
  }

  /**
   * Calls the service by making an HTTP request to the Thingworx server.
   *
   * @param {object} params - the parameters to be used for the service call.
   * @param {Connection} connection - the connection instance to use to make the HTTP request.
   * @returns {ServiceExecutionPromise} - an instance of ServiceExecutionPromise representing
   * the response that will be get (or was already got) from the server.
   */
  call(params, connection) {
    const request = new ServiceExecutionRequest(this, params);
    return request.send(connection);
  }

  /**
   * Builds a string representation of the service.
   *
   * @returns {string} - a string representation of the service.
   */
  toString() {
    return `${this.entity.toString()}.${this.name}`;
  }
}
