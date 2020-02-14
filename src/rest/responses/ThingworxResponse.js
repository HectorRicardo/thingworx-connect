/**
 * Base class that represents a response gotten from a Thingworx server.
 */
export default class ThingworxResponse {
  /**
   * Shells a JavaScript response object in a ThingworxResponse object.
   *
   * @param {Response} response - a Response object.
   * @param {Request} request - the request the response belongs to.
   */
  constructor(response, request) {
    this.response = response;
    this.request = request;
    this.ok = response.ok; // for easy access, instead of having to do .response.ok from the outside
    this.serverURL = request.server.origin;
  }

  /**
   * Returns asynchronously the body of the response as a string.
   *
   * @returns {Promise} - a promise that resolves to the body of the response.
   */
  async text() {
    return this.response.text();
  }

  /**
   * Returns asynchronously the body of the response as JSON.
   *
   * @returns {Promise} - a promise that resolves to the body of the response.
   */
  async json() {
    return this.response.json();
  }

  /**
   * Returns a string representation of this response including status code and description.
   *
   * @returns {string} the string representation of this response.
   */
  toString() {
    return `${this.response.status} ${this.response.statusText}`;
  }

  /**
   * Creates an error object when the response's request couldn't be completed successful.
   * Only call this method if the .ok property of the response is false.
   *
   * @returns {Error} the error object that was built.
   */
  buildError() {
    return new Error(`Could not connect to the server - Error ${this.toString()}`);
  }
}
