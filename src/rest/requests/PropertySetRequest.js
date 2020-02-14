import RequestNeedingAuthentication from './RequestNeedingAuthentication';
import PropertySetResponse from '../responses/PropertySetResponse';

/**
 * Class representing a property set request.
 */
export default class PropertySetRequest extends RequestNeedingAuthentication {
  /**
   * Creates a request to update the value of a property.
   *
   * @param {Property} property - the property whose value is to be set.
   * @param {*} value - the new value to set.
   */
  constructor(property, value) {
    const url = PropertySetRequest.buildRequestURL(property);
    const options = PropertySetRequest.buildRequestOptions(property, value);
    const { server } = property.entity.collection;
    super(url, options, server);
    this.property = property;
    this.value = value;
  }

  /**
   * Sends the request to a Connection instance so that it sends it to the Thingworx server.
   *
   * @param {Connection} connection - the connection instance to use to make the request.
   * @returns {PropertySetResponse} an instance of PropertySetResponse representing the response.
   */
  async send(connection) {
    const response = await connection.sendRequest(this);
    return new PropertySetResponse(response, this);
  }

  /**
   * Returns the url for the property set request.
   *
   * @param {Property} property - the property for which to build the URL.
   * @returns {string} - the url for the property set request.
   */
  static buildRequestURL(property) {
    return `${property.entity.collection.server.origin}/Thingworx/${property.entity.collection.name}/${property.entity.name}/Properties/${property.name}`;
  }

  /**
   * Returns the options for the request.
   *
   * @param {Property} property - the property.
   * @param {*} value - the new value of the property.
   * @returns {object} - the options used for the request.
   */
  static buildRequestOptions(property, value) {
    return {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [property.name]: value }),
    };
  }

  /**
   * Builds a string representation of the property set request.
   *
   * @returns {string} - a string representation of the property set request.
   */
  toString() {
    return `${this.property.toString()} = ${JSON.stringify(this.value, undefined, 2)}`;
  }
}
