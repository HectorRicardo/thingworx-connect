import ServiceExecutionPromise from '../promises/ServiceExecutionPromise';
import RequestNeedingAuthentication from './RequestNeedingAuthentication';

/**
 * Class representing a service execution request.
 */
export default class ServiceExecutionRequest extends RequestNeedingAuthentication {
  /**
   * Creates a request to make a execution service Rest API call.
   *
   * @param {Service} service - the service to be called in the request.
   * @param {object} params - the arguments of the service.
   */
  constructor(service, params) {
    const url = ServiceExecutionRequest.buildRequestURL(service);
    const options = ServiceExecutionRequest.buildRequestOptions(params);
    const { server } = service.entity.collection;
    super(url, options, server);
    this.service = service;
    this.params = params;
  }

  /**
   * Sends the request to a Connection instance so that it sends it to the Thingworx server.
   * Unlike the send method of other requests objects, this one is not asynchronous, because we
   * want to be able to call operations on the promise even before it resolves. Those operations
   * are the methods of the JsonResponsePromise and ServiceExecutionPromise classes.
   *
   * @param {Connection} connection - the connection instance to use to make the request.
   * @returns {ServiceExecutionPromise} an instance of ServiceExecutionPromise that will resolve
   * to the response of the service execution.
   */
  send(connection) {
    const promise = connection.sendRequest(this);
    return new ServiceExecutionPromise(promise, this);
  }

  /**
   * Builds a string representation of the service call.
   *
   * @returns {string} - a string representation of the service call.
   */
  toString() {
    const paramsStringified = this.params == null ? '' : JSON.stringify(this.params, undefined, 2);
    return `${this.service.toString()}(${paramsStringified})`;
  }

  /**
   * Returns the url for the service execution request.
   *
   * @param {Service} service - the service for which to build the URL.
   * @returns {string} - the url for the service execution request.
   */
  static buildRequestURL(service) {
    return `${service.entity.collection.server.origin}/Thingworx/${service.entity.collection.name}/${service.entity.name}/Services/${service.name}`;
  }

  /**
   * Returns the options for the request.
   *
   * @param {object} [params] - the parameters of the service.
   * @returns {object} - the options used for the request.
   */
  static buildRequestOptions(params) {
    return {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    };
  }
}
