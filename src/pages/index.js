import React from 'react';
// import { GatsbyImage } from 'gatsby-plugin-image';

const Page = ({ serverData: { date, explanation, title, url } }) => {
  return (
    <main>
      <small>{new Date(date).toLocaleDateString()}</small>
      <h1>{title}</h1>
      <p>{explanation}</p>
      {/* <GatsbyImage image={gatsbyImage} alt={title} backgroundColor="#242225" /> */}
    </main>
  );
};

export default Page;
