import JsonResponsePromise from './JsonResponsePromise';
import ThingworxResponse from '../responses/ThingworxResponse';

/**
 * Wrapper for a promise that represents the result of a service execution request.
 */
export default class ServiceExecutionPromise extends JsonResponsePromise {
  /**
   * Extracts the single value of the service call's response body.
   * ThingWorx REST API service calls always return json objects or infotable-shaped jsons, even
   * when the result is a single value. This method gets the single value we're interested in from
   * the response.
   *
   * @returns {Promise} a promise resolving to the single value we're interested in
   * @throws {Error} an error if the request was unsuccessful or the response is not a single-value
   * result, e.g., the infotable returned contains multiple columns or multiple rows, or the json
   * does not have the shape of an infotable.
   */
  async val() {
    const infoTable = await this.json();
    if (!JsonResponsePromise.isInfoTable(infoTable) || infoTable.rows.length !== 1) {
      throw new Error(`The request ${this.request.toString()} did not return a single-value result. It returned:\n${JsonResponsePromise.prettify(infoTable)}.`);
    }

    const fieldNames = Object.keys(infoTable.dataShape.fieldDefinitions);
    if (fieldNames.length !== 1) {
      throw new Error(`The request ${this.request.toString()} did not return a single-value result. It returned:\n${JsonResponsePromise.prettify(infoTable)}.`);
    }

    const [fieldName] = fieldNames;
    const result = infoTable.rows[0][fieldName];
    const { baseType } = infoTable.dataShape.fieldDefinitions[fieldName];
    return JsonResponsePromise.parseValue(result, baseType);
  }

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
   * Converts the response's json body to an infotable and returns its rows.
   *
   * @returns {Promise} a promise resolving to the rows of the infotable of the response body.
   * @throws {Error} if the request was not successful or if the response is not an infotable.
   */
  async rows() {
    const infoTable = await this.infoTable();
    return JsonResponsePromise.getInfoTableRows(infoTable);
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
    return new Error(`Received status code ${response.status} from ${response.serverURL} - ${await response.text()}\nError happened while calling ${this.request.toString()}\n`);
  }
}
