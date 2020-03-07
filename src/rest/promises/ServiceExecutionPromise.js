import JsonResponsePromise from './JsonResponsePromise';
import ThingworxResponse from '../responses/ThingworxResponse';

/**
 * Wrapper for a promise that represents the result of a service execution request.
 */
export default class ServiceExecutionPromise extends JsonResponsePromise {
  /**
   * Converts the response's json body to an infotable.
   *
   * @returns {Promise} a promise resolving to the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async infoTable() {
    const infoTable = await this.json();
    if (!JsonResponsePromise.isInfoTable(infoTable)) {
      throw new Error(`The request ${this.request.toString()} did not return an infotable. It returned ${JsonResponsePromise.prettify(infoTable)}.`);
    }
    return JsonResponsePromise.parseInfoTable(infoTable);
  }

  /**
   * Converts the response's json body to an infotable.
   * An alias for .infoTable()
   *
   * @returns {Promise} a promise resolving to the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async it() {
    return this.infoTable();
  }

  /**
   * Converts the response's json body to an infotable.
   * An alias for .infoTable()
   *
   * @returns {Promise} a promise resolving to the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async infotable() {
    return this.infoTable();
  }

  /**
   * Converts the response's json body to an infotable and returns its rows.
   *
   * @returns {Promise} a promise resolving to the rows of the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async rows() {
    const infoTable = await this.infoTable();
    return infoTable.rows;
  }

  /**
   * Checks that the response is ok and defines undefined as the default value when applying the
   * .then() callback on this instance. This is used only for services that don't have any return
   * value. For example:
   *
   * await Resources['EntityServices'].CreateThing({ ... });
   *
   * @returns {Promise} a promise that resolves to undefined.
   */
  async defaultValue() {
    const response = new ThingworxResponse(await this.promise, this.request);
    if (!response.ok) {
      throw await this.buildError(response);
    }
    return undefined;
  }

  /**
   * Builds an error associated to the promise's response.
   * Only call this method if the response's ok status was false.
   *
   * @param {ThingworxResponse} response - the response this promise resolved to.
   * @returns {Error} - an Error object that is ready to be thrown.
   */
  async buildError(response) {
    return new Error(`Error calling ${this.request.toString()}\nFrom ${response.serverURL}\n${await response.text()}`);
  }
}
