# <a href="https://github.com/frontful/frontful-environment"><img heigth="75" src="http://www.frontful.com/assets/packages/environment.png" alt="Frontful Environment" /></a>

`frontful-environment` is packaged provider of environment setup and developer tools for Javascript application development.

Configuration of modern javascript application using [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/) can be fun and exciting, but it may become overwhelming and time consuming. `frontful-environment` is packaged abstraction on top of Babel, Webpack and other great tools to provide simple yet configurable environment setup with essential features, good developer experience and isolation. `frontful-environment` can streamline application development environment setup and help focus on feature implementation instead of Javascript DevOps'ing.

### Features
  - ES6+ environment with ES Modules
  - Cold reload with state persistence and no HMR
    - Reload on server and browser code changes
    - JS, CSS and other imported resources are reloaded
    - Support for reload of linked packages
    - No separate server, no server restarts
  - Server and browser code is built into bundles
    - Server bundle excludes `node_modules`
    - Browser bundle is tree shakeable
    - Browser `node_modules` are placed into vendor bundle
    - Build is stored in memory for development by default
  - Isomorphic resource handling
  - Importing SVG as JSX React component
  - Multiple CSS styling approaches
    - CSS, SCSS, SASS and PCSS
    - CSS Modules
    - Integrated autoprefixer
  - Environment configuration
  - Source maps
  - Linter
  - Error formatting
  - Production build

### Setup

1. Add `frontful-environment` package
```shell
yarn add frontful-environment
# or
npm install -s frontful-environment
```

2. Add `frontful` configuration section to `package.json` that points to browser and server entry scripts.
This step is optional if you are ok with [defaults](https://github.com/frontful/frontful-environment/blob/master/config/index.default.js).
```json
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
```json
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

### Usage

...

#### Assets and bundles

...

#### CSS support

...

#### SVG support

...

#### Cold reload

...

#### Errors

...
