import EntityCollection from '../EntityCollection';
import Dashboard from '../entities/Dashboard';

/**
 * Class representing the Dashboards collection in Thingworx.
 */
export default class Dashboards extends EntityCollection {
  /**
   * Creates the Dashboards collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('Dashboards', Dashboard, server);
  }
}
