import JsonResponsePromise from './JsonResponsePromise';

/**
 * Wrapper for a promise that represents the result of a property retrieval request.
 */
export default class PropertyGetPromise extends JsonResponsePromise {
  /**
   * Uses the .val() method to get the default value when applying the .then() callback on this
   * instance.
   *
   * @returns {Promise} - a promise resolving to the single value of the response.
   */
  defaultValue() {
    return this.val();
  }

  /**
   * Builds an error associated to the promise's response.
   * Only call this method if the response's ok status was false.
   *
   * @param {ThingworxResponse} response - the response this promise resolved to.
   * @returns {Error} - an Error object that is ready to be thrown.
   */
  async buildError(response) {
    return new Error(`Error reading ${this.request.toString()}\nFrom ${response.serverURL}\n${await response.text()}`);
  }
}
