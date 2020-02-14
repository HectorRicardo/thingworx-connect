import EntityCollection from '../EntityCollection';
import ThingTemplate from '../entities/ThingTemplate';

/**
 * Class representing the ThingTemplates collection in Thingworx.
 */
export default class ThingTemplates extends EntityCollection {
  /**
   * Creates the ThingTemplates collection of a particular Thingworx server.
   *
   * @param {Server} server - the Thingworx server to which this collection belongs.
   */
  constructor(server) {
    super('ThingTemplates', ThingTemplate, server);
  }
}
