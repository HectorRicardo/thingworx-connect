import RequestNeedingAuthentication from './RequestNeedingAuthentication';
import PropertyGetPromise from '../promises/PropertyGetPromise';

/**
 * Class representing a property request.
 */
export default class PropertyGetRequest extends RequestNeedingAuthentication {
  /**
   * Creates a request to retrieve the value of a property.
   *
   * @param {Property} property - the property whose value is to be got.
   */
  constructor(property) {
    const url = PropertyGetRequest.buildRequestURL(property);
    const options = PropertyGetRequest.buildRequestOptions();
    const { server } = property.entity.collection;
    super(url, options, server);
    this.property = property;
  }

  /**
   * Sends the request to a Connection instance so that it sends it to the Thingworx server.
   * Unlike the send method of other requests objects, this one is not asynchronous, because we
   * want to be able to call operations on the promise even before it resolves. Those operations
   * are the methods of the JsonResponsePromise and PropertyGetPromise classes.
   *
   * @param {Connection} connection - the connection instance to use to make the request.
   * @returns {PropertyGetPromise} an instance of PropertyGetPromise.
   */
  send(connection) {
    const promise = connection.sendRequest(this);
    return new PropertyGetPromise(promise, this);
  }

  /**
   * Returns the url for the property get request.
   *
   * @param {Property} property - the property for which to build the URL.
   * @returns {string} - the url for the property get request.
   */
  static buildRequestURL(property) {
    return `${property.entity.collection.server.origin}/Thingworx/${property.entity.collection.name}/${property.entity.name}/Properties/${property.name}`;
  }

  /**
   * Returns the options for the request.
   *
   * @returns {object} - the options used for the request.
   */
  static buildRequestOptions() {
    return {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Builds a string representation of the property get request.
   *
   * @returns {string} - a string representation of the property get request.
   */
  toString() {
    return this.property.toString();
  }
}
