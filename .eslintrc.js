module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jsdoc/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'jsdoc/no-undefined-types': ['error', {
      definedTypes: [
        'Thingworx',
        'Server',
        'Connection',
        'ProxyCreator',
        'Dashboards', 'DataShapes', 'DataTags', 'Groups', 'Logs', 'Mashups', 'Menus', 'ModelTags', 'Networks', 'Resources', 'Things', 'ThingShpes', 'ThingTemplates', 'Users',
        'Dashboard', 'DataShape', 'DataTag', 'Group', 'Log', 'Mashup', 'Menu', 'ModelTag', 'Network', 'Resource', 'Thing', 'ThingShpe', 'ThingTemplate', 'User',
        'EntityCollection',
        'Entity',
        'Property',
        'Service',
        'Ping',
        'PropertyGetRequest',
        'PropertySetRequest',
        'ServiceExecutionRequest',
        'RequestNeedingAuthentication',
        'ThingworxResponse',
        'PingResponse',
        'PropertyGetPromise',
        'PropertySetResponse',
        'ServiceExecutionPromise',
        'JsonResponsePromise',
      ]
    }]
  },
  plugins: [
    'jsdoc',
  ],
};
