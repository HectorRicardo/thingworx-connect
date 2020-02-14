/**
 * Class that handles the creation of proxies intended for easy usage.
 * Proxies allow to call from the browser Javascript Thingworx services in a Thingworx-ish way.
 * For example,
 *
 * const result = Things['MyThing'].MyService()
 *
 * even though there is no 'MyThing' property in the Things collection, nor a .MyService() method
 * in the 'MyThing' object.
 *
 * Proxies are associated to a particular connection instance. Explanation:
 * A server contains entity collections, which contains entities, which contain services, which can
 * be called. The link is like this:
 *
 *          |---> Things------------>|---> Thing 1 --->|---> Service 1 --> (services are called by
 *          |---> Things Shapes      |---> Thing 2     |---> Service 2     passing them a connection
 * Server-->|---> Things Templates   |---> Thing 3     |---> Service 3     instance and an object
 *          |---> .......            |---> .......     |---> .......       with its parameters)
 *          |---> .......            |---> .......     |---> .......
 *
 * This model is independent of proxies whatsoever.
 * A connection is a defined as a pair of a server and authentication parameters for that server.
 * A server instance can exist, and there can be many connection instances that connect,
 * authenticate to, and make requests to that server.
 *
 * How does the user can use the Connection class to call entity services of a Thingworx server?
 *
 * This is where proxies como into play.
 *
 * Proxies create entry points for calling the Thingworx services from a particular connection. So
 * once you create a connection, you can create proxies associated to that connection. Then, every
 * service call through the proxies will be sent using the connection object to which the proxies
 * belong.
 *
 * You can create proxies for a connection using the .createEntityCollectionProxies(connection)
 * method.
 */
export default class ProxyCreator {
  /**
   * Creates proxies of all entity collections for a connection instance.
   *
   * @param {Connection} conn - The connection instance for which to build the proxies.
   * @returns {object} a frozen object containing all proxies.
   */
  static createEntityCollectionProxies(conn) {
    const { server } = conn;

    let logs = null;
    let users = null;
    let dashboards = null;
    let groups = null;
    let mashups = null;
    let menus = null;
    let modelTags = null;
    let networks = null;
    let dataTags = null;
    let dataShapes = null;
    let thingShapes = null;
    let thingTemplates = null;
    let things = null;
    let resources = null;

    return Object.freeze({
      get Logs() {
        if (logs === null) {
          logs = ProxyCreator.createCollectionProxy(server.logs, conn);
        }
        return logs;
      },
      get Users() {
        if (users === null) {
          users = ProxyCreator.createCollectionProxy(server.users, conn);
        }
        return users;
      },
      get Dashboards() {
        if (dashboards === null) {
          dashboards = ProxyCreator.createCollectionProxy(server.dashboards, conn);
        }
        return dashboards;
      },
      get Groups() {
        if (groups === null) {
          groups = ProxyCreator.createCollectionProxy(server.groups, conn);
        }
        return groups;
      },
      get Mashups() {
        if (mashups === null) {
          mashups = ProxyCreator.createCollectionProxy(server.mashups, conn);
        }
        return mashups;
      },
      get Menus() {
        if (menus === null) {
          menus = ProxyCreator.createCollectionProxy(server.menus, conn);
        }
        return menus;
      },
      get ModelTags() {
        if (modelTags === null) {
          modelTags = ProxyCreator.createCollectionProxy(server.modelTags, conn);
        }
        return modelTags;
      },
      get Networks() {
        if (networks === null) {
          networks = ProxyCreator.createCollectionProxy(server.networks, conn);
        }
        return networks;
      },
      get DataTags() {
        if (dataTags === null) {
          dataTags = ProxyCreator.createCollectionProxy(server.dataTags, conn);
        }
        return dataTags;
      },
      get DataShapes() {
        if (dataShapes === null) {
          dataShapes = ProxyCreator.createCollectionProxy(server.dataShapes, conn);
        }
        return dataShapes;
      },
      get ThingShapes() {
        if (thingShapes === null) {
          thingShapes = ProxyCreator.createCollectionProxy(server.thingShapes, conn);
        }
        return thingShapes;
      },
      get ThingTemplates() {
        if (thingTemplates === null) {
          thingTemplates = ProxyCreator.createCollectionProxy(server.thingTemplates, conn);
        }
        return thingTemplates;
      },
      get Things() {
        if (things === null) {
          things = ProxyCreator.createCollectionProxy(server.things, conn);
        }
        return things;
      },
      get Resources() {
        if (resources === null) {
          resources = ProxyCreator.createCollectionProxy(server.resources, conn);
        }
        return resources;
      },
      // For changing the authentication params.
      changeAuthMethod(authParams) {
        conn.setAuthParams(authParams);
      },
    });
  }

  /**
   * Creates a proxy for a particular entity collection. As new entities of this particular entity
   * collection get used, they will be remembered by the proxy, so the next time an entity gets
   * used, the proxy will use its existing reference instead of creating a new one.
   *
   * @param {EntityCollection} entityCollection - the collection for which to create a proxy.
   * @param {Connection} connection - The connection instance to which this proxy belongs to. In
   * other words, the connection instance to use to making requests from the entities.
   * @returns {Proxy} the proxy for the entity collection.
   */
  static createCollectionProxy(entityCollection, connection) {
    const proxyHandler = {
      get(entityProxies, entityName) {
        if (!entityProxies.has(entityName)) {
          const entity = entityCollection.getEntity(entityName);
          const entityProxy = ProxyCreator.createEntityProxy(entity, connection);
          entityProxies.set(entityName, entityProxy);
        }
        return entityProxies.get(entityName);
      },
    };

    const entityProxies = new Map();
    return Object.freeze(new Proxy(entityProxies, proxyHandler));
  }

  /**
   * Creates a proxy for a particular entity. As new services of this particular entity get called,
   * they will be remembered by the proxy, so the next time a service is called, the proxy will use
   * its existing reference instead of creating a new one.
   *
   * @param {Entity} entity - the entity for which to create a proxy.
   * @param {Connection} conn - The connection instance to which this proxy belongs to. In other
   * words, the connection instance to use when calling the entities services.
   * @returns {Proxy} the entity proxy.
   */
  static createEntityProxy(entity, conn) {
    const proxyHandler = {
      get(propertyOrServiceProxies, propOrServiceName) {
        if (!propertyOrServiceProxies.has(propOrServiceName)) {
          const proxy = ProxyCreator.createPropertyOrServiceProxy(propOrServiceName, entity, conn);
          propertyOrServiceProxies.set(propOrServiceName, proxy);
        }
        return propertyOrServiceProxies.get(propOrServiceName);
      },
    };

    const propertyOrServiceProxies = new Map();
    return Object.freeze(new Proxy(propertyOrServiceProxies, proxyHandler));
  }

  /**
   * Creates a proxy for an entity's property or service.
   *
   * @param {string} propertyOrServiceName - the property or service to proxy.
   * @param {Entity} entity - the entity which owns the property or service to proxy.
   * @param {Connection} connection - the connection to use for the requests associated to the
   * property or service.
   * @returns {Proxy} - the proxy for the property or service.
   */
  static createPropertyOrServiceProxy(propertyOrServiceName, entity, connection) {
    const proxyHandler = {
      // This applies if propertyOrService is a property and executes when calling .then(),
      // .val(), .json(), .infoTable(), or .set() methods. Any other method results in an error.
      get(_, methodName) {
        switch (methodName) {
          case 'then':
          case 'catch':
          case 'finally':
            return (...args) => entity.getProperty(propertyOrServiceName)
              .get(connection)[methodName](...args);
          case 'set':
            return async (value) => {
              const response = await entity.getProperty(propertyOrServiceName)
                .set(value, connection);
              if (!response.ok) {
                throw await response.buildError();
              }
            };
          default:
            throw new Error(`Unrecognized method ${methodName}`);
        }
      },
      // This will interpret that propertyOrService is a service and execute when appending ()
      // next to the service name.
      apply(_, thisArg, [params]) {
        return entity.getService(propertyOrServiceName).call(params, connection);
      },
    };
    // using a function as the proxy target to enable the 'apply' trap.
    return Object.freeze(new Proxy(() => {}, proxyHandler));
  }
}
