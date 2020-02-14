import EntityCollection from '../EntityCollection';
import DataTag from '../entities/DataTag';

/**
 * Class representing the DataTags collection in Thingworx.
 */
export default class DataTags extends EntityCollection {
  /**
   * Creates the DataTags collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('DataTags', DataTag, server);
  }
}
