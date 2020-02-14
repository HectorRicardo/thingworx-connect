import EntityCollection from '../EntityCollection';
import Log from '../entities/Log';

/**
 * Class representing the Logs collection in Thingworx.
 */
export default class Logs extends EntityCollection {
  /**
   * Creates the Logs collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Logs', Log, server);
  }
}
