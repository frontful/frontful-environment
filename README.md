# <a href="https://github.com/frontful/frontful-environment"><img heigth="75" src="http://www.frontful.com/assets/packages/environment.png" alt="Frontful Environment" /></a>

`frontful-environment` is packaged provider of environment setup, scripts and developer utilities for server and browser Javascript application development. It's environment setup provider for [Frontful](https://github.com/frontful) infrastructure.  
Reference integration can be found in [`frontful-todomvc`](https://github.com/frontful/frontful-todomvc) application.

Configuration of modern javascript applications using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/) can be fun and exciting, it can also be time consuming and somewhat overwhelming. `frontful-environment` is packaged abstraction on top of Babel, Webpack and other great tools to provide simple yet configurable environment setup with essential features, good developer experience, abstraction and isolation. `frontful-environment` can streamline application development environment setup and help to focus on feature implementation instead of Javascript DevOps.

Conceptually `frontful-environment` is similar to [`react-scripts`](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts) in [`react-create-app`](https://github.com/facebookincubator/create-react-app). Difference lyes in that `frontful-environment` focuses not only on build for browser but also server, this results in core infrastructure for developing isomorphic applications, different feature set and mechanics.

### Features
  - ES6+ environment with ES Modules
  - Cold reload with state persistence and no HMR
    - Live reload on both server and browser code changes
    - JS, CSS and other imported resources are reloaded
    - Support for live reload of linked package changes
    - No separate server, no server restarts
  - Server and browser code is built into bundles
    - Server bundle excludes `node_modules`
    - Browser bundle is tree shakeable
    - Browser `node_modules` are placed into vendor bundle
    - Build is stored in memory for development by default
  - Isomorphic resource handling
  - Importing SVG as JSX React component
  - Multiple CSS styling approaches
    - CSS, SCSS and SASS
    - CSS Modules
    - Integrated autoprefixer
  - Environment configuration
  - Production build
  - Utilities
    - Linter
    - Source maps
    - Error parsing

### Mechanics

`frontful-environment` consists of two aspects
  - **Script** - Script is installed under `node_modules/.bin` as `frontful-environment` and provides two variation
    - `frontful-environment start` - Starts application for development with live cold reload and [package development assist](https://github.com/frontful/frontful-common#package-development-assist). _Utilities_ are working in `NODE_ENV=development` mode e.g. _cold reload state persistence_ and _error handling_. Babel and Webpack are building server and browser bundles (in memory by default), these bundles get rebuilt and reloaded when code is changed.
    - `frontful-environment build` - Builds application for `production` and outputs optimized server and browser bundles to `./build` folder. To run production build execute `PORT=8000 node ./build/server`. Babel and Webpack are working only during build process, when application is run Babel and Webpack are not triggered. Certain _utilities_ are disabled or working in `NODE_ENV=production` mode e.g. _cold reload state persistence_ and _error handling_
  - **Utilities** - Provides utilities to access and use certain aspects of `frontful-environment`. To use these utilities `import environment from 'frontful-environment'`.
    - `environment.assets` - Get bundle absolute mount path e.g. `js.main`, `js.vendor`, `css.main`, `css.vendor`.
    - `environment.coldreload` - Utilities for setting `serializer` and `deserializer` handlers and accessing persisted `state`
    - `environment.error` - Utilities for error `parser()` and `getHandler()` Express.js style error handler middleware.
    - `environment.server` - Get current `http` server instance
    - `environment.listener` - Get current `http` server listener instance

### Installation

```shell
# Using yarn
yarn add frontful-environment
# or npm
npm install -s frontful-environment
```

### Integration

By default `frontful-environment` has only one assumption/requirement, that you have two entry points to your applications
  - `./src/browser/index.js` - Entry point for browser bundle
  - `./src/server/index.js` - Entry point for server bundle. **Server entry must exports http request handler or Express.js style application instance.**

To change default entry point file names read section on [Configuration](https://github.com/frontful/frontful-environment#configuration).

Add `start` and `build` `scripts` to `package.json`
```javascript
// package.json
{
  "scripts": {
    "build": "frontful-environment build",
    "start": "frontful-environment start"
  }
}
```

Ensure that entry point file for browser exists e.g. `./src/browser/index.js`.

Ensure that entry point file for server exists e.g. `./src/server/index.js` and that it exports http server request handler or Express.js style instance
```javascript
import express from 'express'
const app = express()
app.use(...)
export default app
```

To start application for `development` run `yarn start` or `npm run start`.  
To build application for `production` run `yarn build` or `npm run build`.  
To start application for production after build run `PORT=8000 node ./build/server`.

For extended integration, e.g. enabling cold reload state persistence or getting mounted path of built assets and bundles, read section on [Utilities](https://github.com/frontful/frontful-environment#utilities)

### Configuration

In `package.json` add `frontful.environment` property. Configuration can be done in several ways as provided by [`frontful-config`](https://github.com/frontful/frontful-config), bellow are two examples.

Value of `frontful.environment` property can be configuration object with property structure as described in configuration [defaults/schema](https://github.com/frontful/frontful-environment/blob/master/config/index.default.js)
```javascript
// package.json
{
  "frontful": {
    "environment": {
      ...
    }
  }
}
```
Value of `frontful.environment` property can also be path to ES5 `.js` file that provides configuration
```javascript
// package.json
{
  "frontful": {
    "environment": "./config.environment.js"
  }
}
```
```javascript
// config.environment.js
module.exports = {
  ...
}
```

#### Babel configuration

`frontful-environment` uses `babel-preset-frontful` as its Babel preset. To customize babel preset refer to [`babel-preset-frontful` Configuration](https://github.com/frontful/babel-preset-frontful#configuration)

#### Webpack configuration

To configure Webpack, refer to `server.webpack` and `browser.webpack` properties in configuration [defaults/schema](https://github.com/frontful/frontful-environment/blob/master/config/index.default.js). Both have two additional properties

- `options` - options that will be passed to [provider/webpack/browser](https://github.com/frontful/frontful-environment/tree/master/provider/webpack/browser) or [provider/webpack/server](https://github.com/frontful/frontful-environment/tree/master/provider/webpack/server). Keep in mind that these options are not Webpack options but ones accepted by provider factory functions.
- `config` - fully formed Webpack configuration that can be created manually or by using [`frontful-environment/provider/webpack/browser`](https://github.com/frontful/frontful-environment/tree/master/provider/webpack/browser) or [`frontful-environment/provider/webpack/server`](https://github.com/frontful/frontful-environment/tree/master/provider/webpack/server) factory functions


### Utilities

#### `bundle`

To get build bundle absolute mount path use `environment.bundle` utility object
```javascript
import environment from 'frontful-environment'
const bundle = environment.bundle
const html = `
  <html>
    <head>
      <link rel="stylesheet" href="${bundle.css.vendor}">
      <link rel="stylesheet" href="${bundle.css.main}">
    </head>
    <body>
      <div id="app"></div>
      <script src="${bundle.js.vendor}"></script>
      <script src="${bundle.js.main}"></script>
    </body>
  </html>
`
```

#### `coldreload`

Depending on what part of code changes server, browser or both, respective bundles get rebuilt and page in the browser is automatically reloaded.

By default client state is lost. To persist and revive application state use `environment.coldreload` utility object
```javascript
// In browser
import environment from 'frontful-environment'
// Return serialized JSON state that needs to be persisted
environment.coldreload.serializer = () => {
  return models.serialize()
}
// Deserialize persisted JSON state to application model
// If cold state is deserialized on server this can be omitted
environment.coldreload.deserializer = (state) => {
  models.deserialize(state)
}
```
```javascript
// On server
import environment from 'frontful-environment'
// Check if serialized state exists and deserialize it to your application model
// For isomorphic apps using React this will ensure that DOM rendered on server matches client DOM
if (environment.coldreload.state) {
  models.deserialize(environment.coldreload.state)
}
```
This mechanic should be compatible with any state management system that support serialization and deserialization, e.g Redux or Mobx.

#### `error`

`frontful-environment` provides cleaned up `Error` output for build errors. Same `Error` parsing can be had in your application by using `environment.error` utility object.  
**This utility works only on server.**
```javascript
import environment from 'frontful-environment'
// Parse error
const error = environment.error.parser(e)
// Log error in with colors
console.log(error.colorful)
// Log error without colors
console.log(error.string)

// To format Express.js errors, mount error handler `Express` middleware as las middleware in application
app.use(environment.error.getHandler())
```

#### `server`

To access http server instance use `environment.server` getter utility
```javascript
import environment from 'frontful-environment'
const server = environment.server
```

#### `listener`

To access http servers listener instance use `environment.listener` getter utility
```javascript
import environment from 'frontful-environment'
const listener = environment.listener
```

### Assets

Assets can be referenced in few ways.

By absolute path to assets. Mount asset folder, then reference asset on its absolute mounted path.
```javascript
import express from 'express'
const app = express()
app.use('/assets', express.static('assets', {maxAge: '7d'}))
```
```css
.container {
  background-image: url(/assets/image.png);
}
```

By importing asset in you Javascript code with extension included. Works with svg, png, jpg, jpeg, gif and ico assets.
```javascript
import image from './image.png'
export default () => (
  <img src={image} />
)
```

By using relative path in CSS. Works with svg, png, jpg, jpeg, gif and ico assets.
```css
.container {
  background-image: url(./image.png);
}
```

If assets are references other than by its absolute path and its file size is less than 1kB its content will be inlined.

### CSS

`frontful-environment` supports standard CSS, SCSS, SASS, as well as CSS Modules for each of these style approaches.  
Frontful infrastructure also provides ability to style application using CSS in JS approach, for more details refer to [`frontful-style`](https://github.com/frontful/frontful-style)

#### Standard CSS, SCSS, SASS
```javascript
// Browser
import `./style.scss`
```

##### CSS Modules

CSS Module support is added by adding `.module` prefix to style extension, e.g. `Component.module.css` or `Component.module.scss`, importing CSS module in your Javascript code.
```css
/* Component.module.css */
.container {
  color: green;
}
```
```javascript
import style from `./Component.module.css`
export default () => (
  <div className={style.container}>
    Hello CSS Modules
  </div>
)
```

### SVG

Apart from using SVG as any other asset by directly referencing or importing it, SVG can be used in React app as React component.  
**For SVG to be interpreted as React component, `.svg` extension must be prefixed with `.jsx` e.g. `icon.jsx.svg`**
```javascript
import Icon from './assets/icon.jsx.svg'
export default () => (
  <div>
    <Icon />
  </div>
)
```

### Package development assist

For more details on package development refer to [package development assist](https://github.com/frontful/frontful-common#package-development-assist)
