# thingworx-connect
A library used to make REST API calls to Thingworx from Node and frontend JavaScript in a Thingworx-ish way.
You can call entities' services and get and set their properties.

## Installation

Install it through npm:
```shell
npm i thingworx-connect
```

Or download one of the stand-alone flavors (for frontend usage):

- Uncompressed, development version: [thingworx-connect.umd.js](https://unpkg.com/thingworx-connect/dist/thingworx-connect.umd.js)
- Minified, production version: [thingworx-connect.umd.min.js](https://unpkg.com/thingworx-connect/dist/thingworx-connect.umd.min.js)

## Important note for browser users

If applicable, please make sure that you enable CORS on the Thingworx server(s) you plan to make requests to.
If you don't have admin access to the server, or don't know what I am talking about, you can always use a CORS proxy.
I recommend using this one: [cors-proxy](https://github.com/HectorRicardo/cors-proxy)

## Usage

Either import the library using an ES6 import (for browsers and web bundlers such as Webpack and Rollup.js):

```javascript
import Thingworx from 'thingworx-connect';
```

Or using a CommonJS import (Node):

```javascript
const Thingworx = require('thingworx-connect');
```

Or include it with a `<script>` tag (for browser usage):

```html
<script src="thingworx-connect.umd.min.js"></script>
```

### Browser usage

You can start making REST API calls to Thingworx right away! Simply pass in your server url to the `.collections()` method of the `Thingworx` object.
If your server url's protocol is `http`, you can omit it. Similarly, if the port is `80`, you can also omit it.

```javascript
async function sample() {
  const { Things, ThingTemplates } = Thingworx.collections('http://localhost:8080');

  /* Reading properties */
  const myProperty = await Things['MyThing'].myProperty;

  /* Setting properties */
  // Make sure you specify the correct property type. In this example,
  // myProperty is of basetype STRING.
  await Things['MyThing'].myProperty.set('hello world');

  /* Calling services */

  // This will return a single value, be it a number, boolean, string, date, etc..
  const squareRoot = await Things['MathUtils'].GetSquareRoot({ number: 9 }).val();
  
  // This will return a json of the shape: { dataShape: { fieldDefinitions: {} }, rows: [] },
  // just as Thingworx infotables.
  const infoTable = await ThingTemplates['GenericThing'].GetImplementingThings().infoTable();

  // This will return only the rows of the resulting infotable, droping down the datashape.
  // If any of the infotable fields is also an infotable, that nested infotable will also have its datashape dropped.
  const infoTableRows = await Things['MyThing'].GetTreeLikeOrg().rows();

  // This will return a json.
  const json = await Things['Utilities'].GetMetadataAsJSON().json();

  // This will return undefined
  await Resources['EntityServices'].CreateThing({
    name: 'MyThing',
    thingTemplate: 'GenericThing',
    description: 'Thing created from browser-side javascript',
  });
}
```
When calling `.collections()`, the browser will ask for your credentials when you make the first request.

You can also pass in the app key:

```javascript
const { Things } = Thingworx.collections('http://localhost:8080', {
  appKey: '896548f2-eaab-46a4-b129-53f1531557a4'
});
```
or your username and password:

```javascript
const { Things } = Thingworx.collections('https://localhost:8080', {
  username: 'myUserName',
  password: 'MyPassw0rd!'
});
```

You can guarantee that two calls to the `.collections()` method with the same parameters (server url and authentication paramaters) will return the same object. That is,

```javascript
const collections1 = Thingworx.collections('localhost:8080');
const collections2 = Thingworx.collections('localhost:8080');
console.log(collections1 === collections2); // Will output 'true'

const collections3 = Thingworx.collections('localhost', { username: 'myUser', password: 'myPassword' });
const collections4 = Thingworx.collections('localhost', { username: 'myUser', password: 'myPassword' });
console.log(collections3 === collections4); // Will also output 'true' 
```

Every time you call the `.collections()`, the library checks if there has been a call to the method wih the same parameters before, and if so, returns the cached result.

There is also another flavor of the `.collections()` method, namely the `.mutableCollections()` method.
The advantage is that with this flavor, you can change the authentication parameters later on. 

For example, given this:

```javascript
const mutableCollections = Thingworx.mutableCollections(thingworxProxyUrl, {
    username: 'myself',
    password: 'myCurrentPassword',
  });
const { Resources, Users, Things } = mutableCollections;
```
We can do this:

```javascript
async function changeUserOnRuntime() {
  // This will print 'myself'
  const currentUsername = await Resources['CurrentSessionInfo'].GetCurrentUser().val();
  console.log(currentUsername);

  // This will print 'otherUser'
  mutableCollections.changeAuthMethod({
    username: 'otherUser',
    password: 'otherPassword',
  });
  const username2ndAttempt = await Resources['CurrentSessionInfo'].GetCurrentUser().val();
  console.log(username2ndAttempt);
}
```

Or more crazy stuff:

```javascript
async function changePasswordOnRuntime() {
  await Users['myself'].ChangePassword({
    oldPassword: 'myCurrentPassword',
    newPassword: 'myNewPassword',
    newPasswordConfirm: 'myNewPassword',
  });

  // this will throw a 401 error
  await Things['MyThing'].MyService(); 

  // However this will perfectly work
  mutableCollections.changeAuthMethod({
    username: 'myself',
    password: 'myNewPassword',
  });
  await Things['MyThing'].MyService();  // success!
}
```

The disadvantage of using `.mutableCollections()` is that every time you call the method, a new set of collections is created (in contrast to the `.collections()` method). That is,

```javascript
const collections1 = Thingworx.mutableCollections('localhost:8080');
const collections2 = Thingworx.mutableCollections('localhost:8080');
console.log(collections1 === collections2); // Will output 'false'

const collections3 = Thingworx.mutableCollections('localhost', { username: 'myUser', password: 'myPassword' });
const collections4 = Thingworx.mutableCollections('localhost', { username: 'myUser', password: 'myPassword' });
console.log(collections3 === collections4); // Will also output 'false' 
```

### Important information for Node users

The usage instructions for Node are the same as the browser usage instructions, except for one thing:
Since Node does not support cookies or credentials (because it is backend), you forcefully need to pass either the
appKey or the username and password to the `.collections()` and `.mutableCollections()` method:

```javascript
const { Things } = Thingworx.collections('http://localhost:8080', {
  appKey: '896548f2-eaab-46a4-b129-53f1531557a4'
});
```
or

```javascript
const { Things } = Thingworx.mutableCollections('https://localhost:8080', {
  username: 'myUserName',
  password: 'MyPassw0rd!'
});
```
