const fetch = require('node-fetch');
const path = require('path');
const { createReadStream, readFileSync, readFile } = require('fs');
const matter = require('gray-matter');
const probe = require('probe-image-size');
const { gatsbyImageResolver } = require('gatsby-plugin-utils/dist/polyfill-remote-file/graphql/gatsby-image-resolver');

// node-fetch @latest .cjs import
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { polyfillImageServiceDevRoutes } = require('gatsby-plugin-utils/polyfill-remote-file');

exports.onCreateDevServer = ({ app }) => {
  polyfillImageServiceDevRoutes(app);
};

// exports.onCreateNode = async ({ node, createContentDigest }) => {
//   if (node.internal.mediaType === 'text/markdown') {
//     const grayMatter = await matter(node.internal.content);
//     const src = `${node.dir}/${grayMatter.data.image}`;
//     const image = await probe(createReadStream(src));

//     // deploy this, use the raw the image url from github.

//     const gatsbyImage = await gatsbyImageResolver(
//       {
//         url: src,
//         mimeType: image.mime,
//         width: image.width,
//         height: image.height,
//         filename: `${grayMatter.data.image}-image`,
//         internal: {
//           contentDigest: createContentDigest(src)
//         }
//       },
//       {
//         width: 400,
//         layout: 'constrained',
//         placeholder: 'none',
//         quality: 10
//       }
//     );

//     console.log('gatsbyImage:', gatsbyImage);
//   }
// };

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
