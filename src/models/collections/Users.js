import EntityCollection from '../EntityCollection';
import User from '../entities/User';

/**
 * Class representing the Users collection in Thingworx.
 */
export default class Users extends EntityCollection {
  /**
   * Creates the Users collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Users', User, server);
  }
}
