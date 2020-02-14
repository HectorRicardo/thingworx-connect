import EntityCollection from '../EntityCollection';
import Network from '../entities/Network';

/**
 * Class representing the Networks collection in Thingworx.
 */
export default class Networks extends EntityCollection {
  /**
   * Creates the Networks collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Networks', Network, server);
  }
}
