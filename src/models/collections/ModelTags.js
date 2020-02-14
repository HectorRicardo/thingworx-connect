import EntityCollection from '../EntityCollection';
import ModelTag from '../entities/ModelTag';

/**
 * Class representing the ModelTags collection in Thingworx.
 */
export default class ModelTags extends EntityCollection {
  /**
   * Creates the ModelTags collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('ModelTags', ModelTag, server);
  }
}
