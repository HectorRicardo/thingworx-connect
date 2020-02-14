import EntityCollection from '../EntityCollection';
import Mashup from '../entities/Mashup';

/**
 * Class representing the Mashups collection in Thingworx.
 */
export default class Mashups extends EntityCollection {
  /**
   * Creates the Mashups collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Mashups', Mashup, server);
  }
}
