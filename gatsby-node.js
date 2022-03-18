const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const matter = require('gray-matter');
const probe = require('probe-image-size');

const {
  polyfillImageServiceDevRoutes,
  addRemoteFilePolyfillInterface
} = require('gatsby-plugin-utils/polyfill-remote-file');

exports.onCreateDevServer = ({ app }) => {
  polyfillImageServiceDevRoutes(app);
};

const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/PaulieScanlon/gatsby-ssg-image-cdn/main/blog/';

exports.createSchemaCustomization = ({ actions, actions: { createTypes }, schema }) => {
  createTypes([
    'type MarkdownRemark implements Node { frontmatter: Frontmatter }',
    `type Frontmatter  {
      date: Date @dateformat(formatString: "DD-MM-YYYY")
      title: String
      remoteImage: MediaAsset @link(from: "image", by: "filename")
    }`,
    addRemoteFilePolyfillInterface(
      schema.buildObjectType({
        name: 'MediaAsset',
        fields: {},
        interfaces: ['Node', 'RemoteFile'],
        extensions: {
          infer: false
        }
      }),
      {
        schema,
        actions
      }
    )
  ]);
};

exports.onCreateNode = async ({ node, actions: { createNode }, createNodeId, createContentDigest }) => {
  if (node.internal.mediaType === 'text/markdown') {
    const grayMatter = await matter(node.internal.content);
    const image = await probe(`${RAW_GITHUB_URL}${node.relativeDirectory}/${grayMatter.data.image}`);

    createNode({
      url: image.url,
      mimeType: image.mime,
      width: image.width,
      height: image.height,
      // linking by filename requires each image to have a unique name
      filename: grayMatter.data.image,
      id: createNodeId(image.url),
      children: [],
      internal: {
        type: 'MediaAsset',
        contentDigest: createContentDigest(String(image.length))
      }
    });
  }
};
