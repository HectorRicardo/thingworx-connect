import EntityCollection from '../EntityCollection';
import Menu from '../entities/Menu';

/**
 * Class representing the Menus collection in Thingworx.
 */
export default class Menus extends EntityCollection {
  /**
   * Creates the Menus collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Menus', Menu, server);
  }
}
