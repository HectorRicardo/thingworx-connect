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
}
