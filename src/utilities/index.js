export default class Utils {
  /**
   * Checks if an object has no properties.
   *
   * @param {object} obj - the object to check.
   * @returns {boolean} true if the object is empty, false otherwise.
   */
  static isObjectEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  /**
   * Checks if a property is in an object
   *
   * @param {object} object - the object.
   * @param {*} property - the property to look for in the object.
   * @returns {boolean} - true if the property is in the object, false otherwise.
   */
  static hasProp(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }

  /**
   * Checks whether a value is an object.
   *
   * @param {*} value - the value to be checked.
   * @returns {boolean} - whether the value is an object.
   */
  static isObject(value) {
    return typeof value === 'object' && value !== null;
  }
}

Utils.isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
