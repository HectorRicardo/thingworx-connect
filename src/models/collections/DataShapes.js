import EntityCollection from '../EntityCollection';
import DataShape from '../entities/DataShape';

/**
 * Class representing the DataShapes collection in Thingworx.
 */
export default class DataShapes extends EntityCollection {
  /**
   * Creates the DataShapes collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('DataShapes', DataShape, server);
  }
}
