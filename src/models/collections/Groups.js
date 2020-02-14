import EntityCollection from '../EntityCollection';
import Group from '../entities/Group';

/**
 * Class representing the Groups collection in Thingworx.
 */
export default class Groups extends EntityCollection {
  /**
   * Creates the Groups collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Groups', Group, server);
  }
}
