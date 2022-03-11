const { polyfillImageServiceDevRoutes } = require('gatsby-plugin-utils/polyfill-remote-file');

exports.onCreateDevServer = ({ app }) => {
  polyfillImageServiceDevRoutes(app);
};
