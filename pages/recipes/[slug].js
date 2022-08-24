import React from 'react';
import Image from 'next/image';
import { SanityClient, usePreviewSubscription } from 'next-sanity';
import { sanityClient, urlFor } from '../../lib/sanity';
import { PortableText } from '@portabletext/react';

const Recipe = ({ data }) => {
  const { recipe } = data;
  console.log(recipe.instructions);
  return (
    <article className='recipe'>
      <h1>{recipe.name}</h1>
      <main className='content'>
        <div className='image-wrapper'>
          <Image
            alt={recipe.name}
            width='100%'
            height='100%'
            layout='fill'
            objectFit='cover'
            src={urlFor(recipe?.mainImage).url()}
          />
        </div>
        <div className='breakdown'>
          <ul className='ingredients'>
            {recipe.ingredient?.map((ingredient) => (
              <li className='ingredient' key={ingredient._key}>
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}{' '}
                {ingredient?.ingredient.name}
                {ingredient?.wholeNumber > 1 ? "'s" : ''}
              </li>
            ))}
          </ul>
          <div className='instructions'>
            <h3>Instructions:</h3>
            <PortableText value={recipe.instructions} components={components} />
          </div>
        </div>
      </main>
    </article>
  );
};

const components = {
  listItem: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => (
      <li className='instruction' style={{ listStyleType: 'none' }}>
        {children}
      </li>
    ),

    // Ex. 2: rendering custom list items
    // checkmarks: ({ children }) => <li> {children}</li>,
  },
};

const recipeQuery = `*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
        _key,
        unit,
        wholeNumber,
        fraction,
        ingredient->{
            name
        }
    },
    instructions
}`;

const slugQuery = `*[_type == "recipe" && defined(slug.current)]{
    "params": {
        "slug": slug.current
    }
}`;
export default Recipe;

export async function getStaticPaths() {
  const paths = await sanityClient.fetch(slugQuery);
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe } } };
}
