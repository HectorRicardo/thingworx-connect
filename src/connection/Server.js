import Dashboards from '../models/collections/Dashboards';
import DataShapes from '../models/collections/DataShapes';
import DataTags from '../models/collections/DataTags';
import Groups from '../models/collections/Groups';
import Logs from '../models/collections/Logs';
import Mashups from '../models/collections/Mashups';
import Menus from '../models/collections/Menus';
import ModelTags from '../models/collections/ModelTags';
import Networks from '../models/collections/Networks';
import Resources from '../models/collections/Resources';
import Things from '../models/collections/Things';
import ThingShapes from '../models/collections/ThingShapes';
import ThingTemplates from '../models/collections/ThingTemplates';
import Users from '../models/collections/Users';

/**
 * Class representing a Thingworx server.
 * Use the .getService() method instead of the constructor for creating instances of this class.
 */
export default class Server {
  /**
   * Creates a reference to a Thingworx server.
   * Precondition: the server origin should already have been cleaned using the static method
   * cleanServerOrigin of this class.
   * Do not call this directly. Use the static method .getService() of this class instead.
   *
   * @param {string} origin - the server origin.
   */
  constructor(origin) {
    this.origin = origin;

    // collections - these fields will be lazily populated when a collection gets accessed using
    // the getters defined below. opt stands for optional, which means that the property will be
    // null until it is accessed for the first time.
    this.opt_logs = null;
    this.opt_users = null;
    this.opt_dashboards = null;
    this.opt_groups = null;
    this.opt_mashups = null;
    this.opt_menus = null;
    this.opt_modelTags = null;
    this.opt_networks = null;
    this.opt_dataTags = null;
    this.opt_dataShapes = null;
    this.opt_thingShapes = null;
    this.opt_thingTemplates = null;
    this.opt_things = null;
    this.opt_resources = null;
  }

  /**
   * Gets the Logs collection
   *
   * @returns {EntityCollection} - the Logs collection
   */
  get logs() {
    if (this.opt_logs === null) {
      this.opt_logs = new Logs(this);
    }
    return this.opt_logs;
  }

  /**
   * Gets the Users collection
   *
   * @returns {EntityCollection} - the Users collection
   */
  get users() {
    if (this.opt_users === null) {
      this.opt_users = new Users(this);
    }
    return this.opt_users;
  }

  /**
   * Gets the Dashboards collection
   *
   * @returns {EntityCollection} - the Dashboards collection
   */
  get dashboards() {
    if (this.opt_dashboards === null) {
      this.opt_dashboards = new Dashboards(this);
    }
    return this.opt_dashboards;
  }

  /**
   * Gets the Groups collection
   *
   * @returns {EntityCollection} - the Groups collection
   */
  get groups() {
    if (this.opt_groups === null) {
      this.opt_groups = new Groups(this);
    }
    return this.opt_groups;
  }

  /**
   * Gets the Menus collection
   *
   * @returns {EntityCollection} - the Menus collection
   */
  get menus() {
    if (this.opt_menus === null) {
      this.opt_menus = new Menus(this);
    }
    return this.opt_menus;
  }

  /**
   * Gets the Mashups collection
   *
   * @returns {EntityCollection} - the Mashups collection
   */
  get mashups() {
    if (this.opt_mashups === null) {
      this.opt_mashups = new Mashups(this);
    }
    return this.opt_mashups;
  }

  /**
   * Gets the ModelTags collection
   *
   * @returns {EntityCollection} - the ModelTags collection
   */
  get modelTags() {
    if (this.opt_modelTags === null) {
      this.opt_modelTags = new ModelTags(this);
    }
    return this.opt_modelTags;
  }

  /**
   * Gets the Networks collection
   *
   * @returns {EntityCollection} - the Networks collection
   */
  get networks() {
    if (this.opt_networks === null) {
      this.opt_networks = new Networks(this);
    }
    return this.opt_networks;
  }

  /**
   * Gets the DataTags collection
   *
   * @returns {EntityCollection} - the DataTags collection
   */
  get dataTags() {
    if (this.opt_dataTags === null) {
      this.opt_dataTags = new DataTags(this);
    }
    return this.opt_dataTags;
  }

  /**
   * Gets the DataShapes collection
   *
   * @returns {EntityCollection} - the DataShapes collection
   */
  get dataShapes() {
    if (this.opt_dataShapes === null) {
      this.opt_dataShapes = new DataShapes(this);
    }
    return this.opt_dataShapes;
  }

  /**
   * Gets the ThingShapes collection
   *
   * @returns {EntityCollection} - the ThingShapes collection
   */
  get thingShapes() {
    if (this.opt_thingShapes === null) {
      this.opt_thingShapes = new ThingShapes(this);
    }
    return this.opt_thingShapes;
  }

  /**
   * Gets the ThingTemplates collection
   *
   * @returns {EntityCollection} - the ThingTemplates collection
   */
  get thingTemplates() {
    if (this.opt_thingTemplates === null) {
      this.opt_thingTemplates = new ThingTemplates(this);
    }
    return this.opt_thingTemplates;
  }

  /**
   * Gets the Things collection
   *
   * @returns {EntityCollection} - the Things collection
   */
  get things() {
    if (this.opt_things === null) {
      this.opt_things = new Things(this);
    }
    return this.opt_things;
  }

  /**
   * Gets the Resources collection
   *
   * @returns {EntityCollection} - the Resources collection
   */
  get resources() {
    if (this.opt_resources === null) {
      this.opt_resources = new Resources(this);
    }
    return this.opt_resources;
  }

  /**
   * Creates a reference to a Thingworx server or, if a reference to that server was already
   * created, returns that one instead of creating a new one.
   * Prefer calling this method in place of the constructor.
   *
   * @param {string} serverOrigin - the server origin.
   * @returns {Server} - an instance of Server associated to the given server origin.
   */
  static getServer(serverOrigin) {
    const { cache } = Server;
    const cleanedServerOrigin = Server.cleanServerOrigin(serverOrigin);
    if (!cache.has(cleanedServerOrigin)) {
      cache.set(cleanedServerOrigin, new Server(cleanedServerOrigin));
    }
    return cache.get(cleanedServerOrigin);
  }

  /**
   * Cleans server origin by adding the http scheme (if no scheme is present) and removing the
   * trailing slash (if present).
   * The empty string is not cleaned, it is returned as it is.
   *
   * @param {string} serverOrigin - the server origin.
   * @returns {string} the cleaned server origin.
   */
  static cleanServerOrigin(serverOrigin) {
    if (serverOrigin === '') return serverOrigin;

    const serverOriginWithScheme = serverOrigin.includes('://') ? serverOrigin : `http://${serverOrigin}`;
    return serverOriginWithScheme.replace(/\/$/, '');
  }
}

/**
 * Used for caching server instances. This avoids creating new instances that point to the same
 * server.
 */
Server.cache = new Map();
