import React from 'react';
import { graphql, Link } from 'gatsby';
// import { GatsbyImage } from 'gatsby-plugin-image';

const Page = ({
  data: {
    gatsbyImage,
    markdownRemark: {
      frontmatter: {
        title,
        date,
        image: { publicURL }
      },
      html
    }
  }
}) => {
  console.log('gatsbyImage: ', gatsbyImage);

  return (
    <main>
      <Link to="/">Back</Link>
      {/* <img src={publicURL} alt={title} /> */}
      {/* <GatsbyImage image={gatsbyImage} alt={title} /> */}
      <h1>{title}</h1>
      <h2>{date}</h2>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
};

export default Page;

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      id
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        image {
          publicURL
        }
      }
      gatsbyImage {
        layout
      }
    }
  }
`;
