import React from 'react';
import Image from 'next/image';
import { SanityClient, usePreviewSubscription } from 'next-sanity';
import { sanityClient, urlFor, PortableText } from '../../lib/sanity';

const Recipe = ({ data }) => {
  const { recipe } = data;
  console.log(recipe.instructions);
  return (
    <article>
      <h1>{recipe.name}</h1>
      <main>
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
        <div>
          <ul>
            {recipe.ingredient?.map((ingredient) => (
              <li key={ingredient._key}>
                {ingredient?.wholeNumber}
                {ingredient?.fraction} {ingredient?.unit}
                {/* <br /> */}
                {ingredient?.ingredient.name}
                {ingredient?.wholeNumber > 1 ? "'s" : ''}
              </li>
            ))}
          </ul>
          <h3>Instructions:</h3>
          <PortableText
            value={[recipe.instructions]}
            components={{
              block: {
                // Customize block types with ease
                h1: ({ children }) => <h1 className='text-2xl'>{children}</h1>,

                // Same applies to custom styles
                customHeading: ({ children }) => (
                  <h2 className='text-lg text-primary text-purple-700'>
                    {children}
                  </h2>
                ),
              },
            }}
          />
        </div>
      </main>
    </article>
  );
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
