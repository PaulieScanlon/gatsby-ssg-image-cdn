require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

module.exports = {
  siteMetadata: {
    title: 'gatsby-ssg-image-cdn'
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'blog',
        path: `${__dirname}/blog`
      }
    },
    'gatsby-transformer-remark',
    'gatsby-plugin-image'
  ]
};
