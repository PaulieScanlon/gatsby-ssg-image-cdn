require('dotenv').config({
  path: `.env`
});

module.exports = {
  siteMetadata: {
    title: 'gatsby-ssg-image-cdn'
  },
  plugins: ['gatsby-plugin-image']
};
