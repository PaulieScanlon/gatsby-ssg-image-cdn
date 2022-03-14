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
            frontmatter: { title },
            gatsbyPath
          } = node;
          return (
            <li key={index}>
              <Link to={gatsbyPath}>{title}</Link>
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
        }
        gatsbyPath(filePath: "/blog/{MarkdownRemark.parent__(File)__name}")
      }
    }
  }
`;

export default Page;
