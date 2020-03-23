import JsonResponsePromise from './JsonResponsePromise';

/**
 * Wrapper for a promise that represents the result of a property retrieval request.
 */
export default class PropertyGetPromise extends JsonResponsePromise {
  /**
   * Extracts the value of the response body.
   * ThingWorx REST API property read calls always infotable-shaped jsons containing a single value.
   * This method gets that single value.
   *
   * @returns {Promise} a promise resolving to the single value we're interested in
   * @throws {Error} an error if the request was unsuccessful.
   */
  async val() {
    const infoTable = await this.json();
    const { fieldDefinitions } = infoTable.dataShape;
    const [fieldName] = Object.keys(fieldDefinitions);
    const result = infoTable.rows[0][fieldName];
    const { baseType } = fieldDefinitions[fieldName];
    return JsonResponsePromise.parseValue(result, baseType);
  }

  /**
   * Converts the response's json body to an infotable and returns its rows.
   *
   * @returns {Promise} a promise resolving to the rows of the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async rows() {
    const infoTable = await this.val();
    if (!JsonResponsePromise.isInfoTable(infoTable)) {
      throw new Error(`The request ${this.request.toString()} did not return an infotable. It returned ${JsonResponsePromise.prettify(infoTable)}.`);
    }
    return JsonResponsePromise.getInfoTableRows(infoTable);
  }

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
