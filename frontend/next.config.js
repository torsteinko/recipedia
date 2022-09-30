module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  reactStrictMode: true,
  env: {
    IMAGE_PATH: 'http://127.0.0.1:8000/media/',
  },
};
