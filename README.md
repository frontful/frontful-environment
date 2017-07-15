# <a href="https://github.com/frontful/frontful-environment"><img heigth="75" src="http://www.frontful.com/assets/packages/environment.png" alt="Frontful Environment" /></a>

`frontful-environment` is packaged provider of environment setup and developer tools for Javascript application development for [Node](https://nodejs.org/) and browser.

Configuration of modern javascript application using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/) can be fun and exciting, but it may become overwhelming and time consuming. `frontful-environment` is packaged abstraction on top of Babel, Webpack and other great tools to provide simple yet configurable environment setup with essential features, good developer experience and isolation. `frontful-environment` can streamline application development environment setup and help focus on feature implementation instead of Javascript DevOps'ing.

Conceptually `frontful-environment` is similar to [`react-scripts`](https://github.com/facebookincubator/create-react-app/tree/master/packages/react-scripts) in [`react-create-app`](https://github.com/facebookincubator/create-react-app). Difference lyes in that `frontful-environment` focuses not only on build for browser but also build for Node server, this results in basic infrastructure for creating isomorphic applications.

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
  - Source maps
  - Linter
  - Error formatting
  - Production build

<!--
### Setup using [CLI](https://github.com/frontful/frontful-cli)

```shell
# Install frontful CLI globally using npm
npm install -g frontful-cli
# Run frontful CLI to scaffold new project
frontful
```
-->

### Manual setup

1. Add `frontful-environment` package
```shell
yarn add frontful-environment
# or
npm install -s frontful-environment
```

2. Add `frontful` configuration section to `package.json` that points to browser and server entry scripts.
This step is optional if you are ok with [defaults](https://github.com/frontful/frontful-environment/blob/master/config/index.default.js).
```javascript
// package.json
{
  "frontful": {
    "environment": {
      "server": {
        "index": "./src/server/index.js"
      },
      "browser": {
        "index": "./src/browser/index.js"
      }
    }
  }
}
```
**File to which `frontful.environment.server.index` points to must export http request handler function or [Express.js](http://expressjs.com/) like instance that will handle requests**

3. Add `start` and `build` scripts to `scripts` section of `package.json`
```javascript
// package.json
{
  "scripts": {
    "build": "frontful-environment build",
    "start": "frontful-environment start"
  }
}
```
Run `yarn start` or `npm run start` to start application for development.  
Run `yarn build` or `npm run build` to build application for production.  
Run `node ./build/server` to start application for production

### Configuration

In `package.json` add `frontful.environment` property.

Value of `frontful.environment` property can be configuration object with property structure as described [here](https://github.com/frontful/frontful-environment/blob/master/config/index.default.js)
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
Value of `frontful.environment` property can be path to ES5 `.js` file that provides configuration
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

#### Assets

Assets can be referenced in few ways
  - By absolute asset path; Mount asset folder and reference asset by its mounted path
  - By importing asset (svg, png, jpg, jpeg, gif, ico), extension must be included
  ```javascript
  import image from './image.png'
  export default () => (
    <img src={image} />
  )
  ```
  If asset is less than 1k in size, it will be inlined
  - By using relative path in CSS
  ```css
  .container {
    background-image: url(./image.png);
  }
  ```
  If asset is less than 1k in size, it will be inlined

#### Bundle

To get build bundle file path use `environment.bundle` object
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

#### CSS support

`frontful-environment` supports standard CSS, SCSS, SASS, as well as CSS Modules for each of these style approaches.

##### Standard CSS, SCSS, SASS
```javascript
// Browser
import `./style.scss`
```

##### CSS Modules
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
**CSS Module support is added by adding `.module` prefix to style extension, e.g. `Component.module.css` or `Component.module.scss`**

#### SVG support

Apart from using SVG as any other asset by directly referencing or importing, SVG can be used in React app as React component.
```javascript
import Icon from './assets/icon.jsx.svg'
export default () => (
  <div>
    <Icon />
  </div>
)
```
**For SVG to be interpreted as React component, `.svg` extension must be prefixed with `.jsx` e.g. `icon.jsx.svg`**

#### Cold reload

Depending on what part of code changes server and/or browser bundles get rebuilt and page in browser is automatically reloaded.

By default client state is lost. To persist and revive application state use global `environment.coldreload` helper object
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
This mechanic should be compatible with any state management system that support serialization and deserialization, e.g Redux or Mobx

#### Errors

`frontful-environment` provides cleaned up `Error` output for build errors. Same `Error` parsing can be added on server using global `environment.error` helper object
```javascript
import environment from 'frontful-environment'
// Parse error
const error = environment.error.parser(e)
// Log error in with colors
console.log(error.colorful)
// Log error without colors
console.log(error.string)

// Format `Express` errors, mount `handler` `Express` middleware as las middleware in application
app.use(environment.error.getHandler())
```

#### Misc

```javascript
import environment from 'frontful-environment'
// Get http server instance
environment.server
// Get http server listener instance
environment.listener
```

#### Babel

See [`babel-preset-frontful`](https://github.com/frontful/babel-preset-frontful)

#### Webpack

...

#### Package development

See  [`frontful-common`](https://github.com/frontful/frontful-common)
