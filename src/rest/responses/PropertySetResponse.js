import ThingworxResponse from './ThingworxResponse';

/**
 * Class representing a Property Set response.
 */
export default class PropertySetResponse extends ThingworxResponse {
  /**
   * Builds an error associated to this response.
   * The reason this method is asynchronous is because the response's body contains the error
   * message, and we need to wait until we download it.
   * Only call this method if the response's ok status was false.
   *
   * @returns {Promise} - an object that resolves to an error ready to be thrown.
   */
  async buildError() {
    return new Error(`Error setting ${this.request.toString()}.\nFrom ${this.serverURL}\n${await this.response.text()}`);
  }
}
