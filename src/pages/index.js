import React from 'react';
import { Link, graphql } from 'gatsby';

const Page = ({
  data: {
    allMarkdownRemark: { nodes }
  }
}) => {
  return (
    <main>
      <ul>
        {nodes.map((node, index) => {
          const {
            frontmatter: { slug, title }
          } = node;
          return (
            <li key={index}>
              <Link to={slug}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export const query = graphql`
  {
    allMarkdownRemark {
      nodes {
        frontmatter {
          title
          slug
        }
      }
    }
  }
`;

export default Page;
