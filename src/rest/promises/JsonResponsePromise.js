import ThingworxResponse from '../responses/ThingworxResponse';

/**
 * Checks if a property is in an object
 *
 * @param {object} object - the object.
 * @param {*} property - the property to look for in the object.
 * @returns {boolean} - true if the property is in the object, false otherwise.
 */
function hasProp(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

/**
 * Checks whether a value is an object.
 *
 * @param {*} value - the value to be checked.
 * @returns {boolean} - whether the value is an object.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * Wrapper for a promise that represents a Thingworx response whose body contains JSON.
 */
export default class JsonResponsePromise {
  /**
   * Wraps a fetch promise to be handled as request's response whose body contains JSON.
   *
   * @param {Promise} promise - the promise resulting from the fetch to Thingworx.
   * @param {ServiceExecutionRequest|PropertyGetRequest} request - the request that created the
   * promise.
   */
  constructor(promise, request) {
    this.promise = promise;
    this.request = request;
  }

  /**
   * Extracts the single value of the response body.
   * ThingWorx REST API calls always return json objects or infotable-shaped jsons, even when the
   * result is a single value. This method gets the single value we're interested in from the
   * response.
   *
   * @returns {Promise} a promise resolving to the single value we're interested in
   * @throws {Error} an error if the request was unsuccessful or the response is not a single-value
   * result, e.g., the infotable returned contains multiple columns or multiple rows, or the json
   * does not have the shape of an infotable.
   */
  async val() {
    const infoTable = await this.json();
    if (!JsonResponsePromise.isInfoTable(infoTable) || infoTable.rows.length !== 1) {
      throw new Error(`The request ${this.request.toString()} did not return a single-value result. It returned:\n${JsonResponsePromise.prettifyInfoTable(infoTable)}.`);
    }

    const fieldNames = Object.keys(infoTable.dataShape.fieldDefinitions);
    if (fieldNames.length !== 1) {
      throw new Error(`The request ${this.request.toString()} did not return a single-value result. It returned:\n${JsonResponsePromise.prettifyInfoTable(infoTable)}.`);
    }

    const [fieldName] = fieldNames;
    const result = infoTable.rows[0][fieldName];
    const { baseType } = infoTable.dataShape.fieldDefinitions[fieldName];
    return JsonResponsePromise.parseValue(result, baseType);
  }

  /**
   * Parses the response's json body of the fetch request.
   *
   * @returns {Promise} a promise resolving to the object resulting from the json parsing.
   * @throws {Error} if the request was not successful.
   */
  async json() {
    const response = new ThingworxResponse(await this.promise, this.request);
    if (!response.ok) {
      throw await this.buildError(response);
    }
    return response.json();
  }

  /* This method is to make this class a Thenable.
     The presence of this method allows this class to be used in conjunction with the await keyword
     without having to use the .json(), .val(), or .infoTable() methods.
  */
  then(successCallback, failureCallback) {
    // The .defaultValue() is implemented in the subclasses.
    // It defines the default value to which this promise should resolve without needing to call the
    // .json(), .val(), or .infoTable() methods.
    return this.defaultValue().then(successCallback, failureCallback);
  }

  /* Implement catch promise method */
  catch(failureCallback) {
    return this.promise.catch(failureCallback);
  }

  /* Implement finally promise method */
  finally(finallyCallback) {
    return this.promise.finally(finallyCallback);
  }

  /**
   * Checks if a value is an infotable.
   *
   * @param {*} value - value to be checked.
   * @returns {boolean} true if value is infotable, false otherwise.
   */
  static isInfoTable(value) {
    return isObject(value)
          && Array.isArray(value.rows)
          && isObject(value.dataShape)
          && isObject(value.dataShape.fieldDefinitions);
  }

  /**
   * Prettifies the infotable by stringifying it to JSON and putting indentation.
   *
   * @param {object} infoTable - an infotable-shaped object.
   * @returns {string} - the string prettified version of the infotable.
   */
  static prettifyInfoTable(infoTable) {
    return JSON.stringify(infoTable, undefined, 2);
  }

  /**
   * Converts a single value received from a Thingworx response JSON to a JavaScript value.
   *
   * @param {number|string|boolean|null} value - the value to be parsed
   * @param {string} baseType - the Thingworx base type of the value.
   *
   * @returns {*} the final value already converted
   */
  static parseValue(value, baseType) {
    switch (baseType) {
      case 'DATETIME':
        return new Date(value);
      case 'INFOTABLE':
        return JsonResponsePromise.parseInfoTable(value);
      default:
        return value;
    }
  }

  /**
   * Converts all JSON values in the infotable to JavaScript values.
   * InfoTables are send through the network as JSONs, which in the end, they are just simple
   * strings. JSON.parse() converted those strings back to JavaScript values, but some values need
   * more conversion. In particular, if you stringify a Date and then parse it as a json, the result
   * will be a string. You still need to convert the string back to a real instance Date. This
   * method does exactly that.
   * Precondition: the infotable object must be valid. JsonResponsePromise.isInfoTable(infoTable)
   * must return true.
   *
   * @param {object} infoTable - the infotable whose values are to be parsed.
   * @returns {object} - the same object given as parameter, for ease of use. The parameter might
   * have been imperatively modified by this method.
   */
  static parseInfoTable(infoTable) {
    const { fieldDefinitions } = infoTable.dataShape;

    const dateTimeFields = [];
    const infoTableFields = [];
    Object.entries(fieldDefinitions).forEach(([fieldName, fieldObj]) => {
      const { baseType } = fieldObj;
      if (baseType === 'DATETIME') {
        dateTimeFields.push(fieldName);
      } else if (baseType === 'INFOTABLE') {
        infoTableFields.push(fieldName);
      }
    });

    infoTable.rows.forEach((row) => {
      dateTimeFields.forEach((dateTimeField) => {
        if (hasProp(row, dateTimeField) && row[dateTimeField] !== null) {
          row[dateTimeField] = new Date(row[dateTimeField]);
        }
      });
      infoTableFields.forEach((infoTableField) => {
        if (hasProp(row, infoTableField) && row[infoTableField] !== null) {
          row[infoTableField] = JsonResponsePromise.parseInfoTable(row[infoTableField]);
        }
      });
    });

    return infoTable;
  }
}
