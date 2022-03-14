const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const matter = require('gray-matter');

const probe = require('probe-image-size');
const { gatsbyImageResolver } = require('gatsby-plugin-utils/dist/polyfill-remote-file/graphql/gatsby-image-resolver');

const { polyfillImageServiceDevRoutes } = require('gatsby-plugin-utils/polyfill-remote-file');

exports.onCreateDevServer = ({ app }) => {
  polyfillImageServiceDevRoutes(app);
};

const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/PaulieScanlon/gatsby-ssg-image-cdn/main/blog/';

exports.createSchemaCustomization = ({ actions: { createTypes, printTypeDefinitions } }) => {
  createTypes(`
    type MarkdownRemark implements Node {
      gatsbyImage: gatsbyImage @link(from: "fields.gatsbyImage")
    }
  `);

  // printTypeDefinitions({ path: './typeDefs.txt' });
};

exports.onCreateNode = async ({
  node,
  actions,
  actions: { createNode, createNodeField },
  createNodeId,
  createContentDigest
}) => {
  if (node.internal.mediaType === 'text/markdown') {
    const grayMatter = await matter(node.internal.content);
    const image = await probe(`${RAW_GITHUB_URL}${node.relativeDirectory}/${grayMatter.data.image}`);

    const gatsbyImage = await gatsbyImageResolver(
      {
        url: image.url,
        mimeType: image.mime,
        width: image.width,
        height: image.height,
        filename: `${grayMatter.data.image}-image`,
        internal: {
          contentDigest: createContentDigest(image)
        }
      },
      {
        width: 400,
        layout: 'constrained',
        placeholder: 'none',
        quality: 10
      },
      actions
    );

    const gatsbyImageNode = createNode({
      ...gatsbyImage,
      id: createNodeId(`${grayMatter.data.image}-image`),
      parent: node.id,
      children: [],
      internal: {
        type: 'gatsbyImage',
        mediaType: 'image/jpeg',
        contentDigest: createContentDigest(image)
      }
    });

    createNodeField({ node, name: 'gatsbyImage', value: gatsbyImageNode.id });
  }
};
