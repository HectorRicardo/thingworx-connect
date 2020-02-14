import PingResponse from '../responses/PingResponse';
import RequestNeedingAuthentication from './RequestNeedingAuthentication';

/**
 * Class representing a ping to the Thingworx server.
 */
export default class Ping extends RequestNeedingAuthentication {
  /**
   * Creates a ping to the Thingworx server.
   *
   * @param {string} server - the Thingworx server to ping. Instance of Server.
   */
  constructor(server) {
    const url = Ping.buildRequestURL(server);
    const options = null;
    super(url, options, server);
  }

  /**
   * Builds the request URL for the pings
   *
   * @param {Server} server - the Server instance for which to build the URL.
   * @returns {string} the request URL.
   */
  static buildRequestURL(server) {
    return `${server.origin}/Thingworx/Composer`;
  }

  /**
   * Sends a ping to the Thingworx server.
   *
   * @param {Connection} connection - the connection instance to use to make the request.
   * @returns {Promise} a promise that resolves to an instance of PingResponse.
   */
  async send(connection) {
    const response = await connection.sendRequest(this);
    return new PingResponse(response);
  }
}
