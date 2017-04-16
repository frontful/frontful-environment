module.exports = {
  webpack: {
    server: {
      options: null,
      config: null,
    },
    browser: {
      options: null,
      config: null,
    },
  },
  modules: [
    'frontful-environment',
    'babel-preset-frontful',
    'eslint-config-frontful',
  ],
  port: 8000,
}
