# thingworx-connect
A library used to make REST API calls to Thingworx from browser-side JavaScript in a Thingworx-ish way.
You can call entities' services and get and set their properties.

## Installation

Install it through npm:
```shell
npm i thingworx-connect
```

Or download one of the stand-alone flavors

- Uncompressed, development version: [thingworx-connect.umd.js](https://unpkg.com/thingworx-connect/dist/thingworx-connect.umd.js)
- Minified, production version: [thingworx-connect.umd.min.js](https://unpkg.com/thingworx-connect/dist/thingworx-connect.umd.min.js)

## Before Using

If applicable, please make sure that you enable CORS on the Thingworx server(s) you plan to make requests to.
If you don't have admin access to the server, or don't know what I am talking about, you can always use a CORS proxy.
I recommend using this one: [cors-proxy](https://github.com/HectorRicardo/cors-proxy)

## Usage

Either import the library using an ES6 import:

```javascript
import Thingworx from 'thingworx-connect';
```

Or include it with a `<script>` tag:

```html
<script src="thingworx-connect.umd.min.js"></script>
```

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
When calling `.collections()` without arguments, the browser will ask for your credentials when you make the first request.

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

You can also change the authentication parameters later on. Given this:

```javascript
const collections = Thingworx.collections(thingworxProxyUrl, {
    username: 'myself',
    password: 'myCurrentPassword',
  });
const { Resources, Users, Things } = collections;
```
We can do this:

```javascript
async function changeUserOnRuntime() {
  // This will print 'myself'
  const currentUsername = await Resources['CurrentSessionInfo'].GetCurrentUser().val();
  console.log(currentUsername);

  // This will print 'otherUser'
  collections.changeAuthMethod({
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
  collections.changeAuthMethod({
    username: 'myself',
    password: 'myNewPassword',
  });
  await Things['MyThing'].MyService();  // success!
}
```
