import EntityCollection from '../EntityCollection';
import ThingShape from '../entities/ThingShape';

/**
 * Class representing the ThingShapes collection in Thingworx.
 */
export default class ThingShapes extends EntityCollection {
  /**
   * Creates the ThingShapes collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('ThingShapes', ThingShape, server);
  }
}
