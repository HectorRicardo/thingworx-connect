import EntityCollection from '../EntityCollection';
import Resource from '../entities/Resource';

/**
 * Class representing the Resources collection in Thingworx.
 */
export default class Resources extends EntityCollection {
  /**
   * Creates the Resources collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Resources', Resource, server);
  }
}
