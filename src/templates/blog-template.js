import React from 'react';
import { graphql } from 'gatsby';

const Page = ({
  data: {
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
  return (
    <main>
      <img src={publicURL} alt={title} />
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
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        image {
          publicURL
        }
      }
    }
  }
`;
