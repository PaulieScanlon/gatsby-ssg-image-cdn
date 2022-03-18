import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

const Page = ({
  data: {
    markdownRemark: {
      frontmatter: {
        title,
        date,
        remoteImage: { gatsbyImage }
      },
      html
    }
  }
}) => {
  return (
    <main>
      <Link to="/">Back</Link>
      <GatsbyImage image={gatsbyImage} alt={title} />
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
        remoteImage {
          gatsbyImage(width: 700, layout: FULL_WIDTH, placeholder: BLURRED)
        }
      }
    }
  }
`;
