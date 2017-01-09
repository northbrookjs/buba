# @northbrook/buba

> Build your ES2015+ projects with Buba :heart:

Transpile your ES2015+ code into ES5 with [Buba](https://github.com/davidchase/buba).

For ease of setup, your `.js` files *must* be located inside of a directory named
`src` at the root of your packages.

## Let me have it
```sh
npm install --save @northbrook/buba
# or
yarn add @northbrook/buba
```

## Configuration

```js
// northbrook.js
const buba = require('@northbrook/buba').plugin

module.exports = {
  plugins: [
    buba,
  ],

  // 100% optional
  buba: {
    // Please see the buba documentation for more information on
    // what options are available :)
    bubleOptions: { ... },
    babelOptions: { ... }
  }
}
```
