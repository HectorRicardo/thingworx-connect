import Utils from '../utilities';

/**
 * The request options modifier will modify the request options before sending out the request
 * to the Thingworx server. This will ensure that the options contains the correct authentication
 * parameters.
 */
export default class OptionsModifier {
  /**
   * Sets the credentials to 'include' in the request options.
   *
   * @param {object} options - the options that will be used for a fetch request.
   */
  static addCredentialsToOptions(options) {
    options.credentials = 'include';
  }

  /**
   * Returns the options modifier callback for when the authentication mode is 'appKey'.
   *
   * @param {string} appKey - the appKey to use for authentication.
   * @returns {Function} the options modifier callback for when the authentication mode is 'appKey'.
   */
  static createAppKeyModifier(appKey) {
    return function addAppKeyToOptions(options) {
      if (options.headers == null) {
        options.headers = {};
      }
      options.headers.appKey = appKey;
    };
  }

  /**
   * Returns the options modifier callback for when the authentication mode is 'basic'.
   *
   * @param {string} username - the username to use for authentication.
   * @param {string} password - the password to use for authentication.
   * @returns {Function} the options modifier callback for when the authentication mode is 'basic'.
   */
  static createBasicAuthModifier(username, password) {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
    return function addBasicAuthToOptions(options) {
      if (options.headers == null) {
        options.headers = {};
      }
      options.headers.Authorization = authHeader;
    };
  }

  /**
   * Returns the request options modifier customized according to the authentication parameters.
   * Caches the existing modifiers (the ones that were returned before through this method), so
   * existing ones are returned instead of creating and duplicating new modifiers.
   *
   * @param {object} authParams - the authentication parameters used to authenticate to the
   * Thingworx server. See the documentation of Thingworx.collections() or Thingworx.connect() for
   * details of these parameters.
   * @returns {Function} the modifier function that will modify the options of the requests to
   * include the authentication parameters given
   */
  static getModifier(authParams) {
    if (authParams == null || Utils.isObjectEmpty(authParams)) {
      return OptionsModifier.addCredentialsToOptions;
    }

    const { appKey, username, password } = authParams;

    // Check if we should return an app key modifier
    const { appKeyModifiersCache } = OptionsModifier;
    if (appKey != null && username == null && password == null) {
      if (!appKeyModifiersCache.has(appKey)) {
        const modifier = OptionsModifier.createAppKeyModifier(appKey);
        appKeyModifiersCache.set(appKey, modifier);
      }
      return appKeyModifiersCache.get(appKey);
    }

    // Check if we should return a basic authorization modifier
    const { basicAuthModifiersCache } = OptionsModifier;
    if (username != null && password != null && appKey == null) {
      const key = `${btoa(`${username}:${password}`)}`;
      if (!basicAuthModifiersCache.has(key)) {
        const modifier = OptionsModifier.createBasicAuthModifier(username, password);
        basicAuthModifiersCache.set(key, modifier);
      }
      return basicAuthModifiersCache.get(key);
    }

    // throws an error because auth parameters combination was wrong.
    throw new Error('Authentication parameters combination is wrong.');
  }
}

/** Maps appKeys to modifiers */
OptionsModifier.appKeyModifiersCache = new Map();

/** Maps username/password combinations to modifiers */
OptionsModifier.basicAuthModifiersCache = new Map();
