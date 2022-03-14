const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const matter = require('gray-matter');

const probe = require('probe-image-size');
const { gatsbyImageResolver } = require('gatsby-plugin-utils/dist/polyfill-remote-file/graphql/gatsby-image-resolver');

const { polyfillImageServiceDevRoutes } = require('gatsby-plugin-utils/polyfill-remote-file');

exports.onCreateDevServer = ({ app }) => {
  polyfillImageServiceDevRoutes(app);
};

const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/PaulieScanlon/gatsby-ssg-image-cdn/main/blog/';

exports.onCreateNode = async ({ node, actions: { createNode }, createNodeId, createContentDigest }) => {
  if (node.internal.mediaType === 'text/markdown') {
    const grayMatter = await matter(node.internal.content);

    const image = await probe(`${RAW_GITHUB_URL}${node.relativeDirectory}/${grayMatter.data.image}`);

    const gatsbyImage = await gatsbyImageResolver(
      {
        url: image.url,
        mimeType: image.mime,
        width: image.width,
        height: image.height,
        filename: `${grayMatter.data.image}-image`
      },
      {
        width: 400,
        layout: 'constrained',
        placeholder: 'none',
        quality: 10
      }
    );

    createNode({
      ...gatsbyImage,
      id: createNodeId(`${grayMatter.data.image}-image`),
      parent: null,
      children: [],
      internal: {
        type: 'gatsbyImage',
        mediaType: 'image/jpeg',
        contentDigest: createContentDigest(image)
      }
    });
  }
};

exports.createPages = async ({ graphql, actions: { createPage }, reporter }) => {
  const { data } = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            id
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  if (data.errors) {
    reporter.panicOnBuild('🚨  ERROR: Loading "createPages" query');
  }

  data.allMarkdownRemark.edges.forEach(({ node }) => {
    const {
      id,
      frontmatter: { slug }
    } = node;

    createPage({
      id: id,
      path: slug,
      component: path.resolve(`./src/templates/blog-template.js`),
      context: { id: id, slug: slug }
    });
  });
};
