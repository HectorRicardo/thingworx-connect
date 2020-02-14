import EntityCollection from '../EntityCollection';
import Thing from '../entities/Thing';

/**
 * Class representing the Things collection in Thingworx.
 */
export default class Things extends EntityCollection {
  /**
   * Creates the Things collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Things', Thing, server);
  }
}
