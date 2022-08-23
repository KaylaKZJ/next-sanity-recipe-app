import { createClient, createPreviewSubscriptionHook } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

import { PortableText as PortableTextComponent } from '@portabletext/react';

const config = {
  projectId: '5f8j9l9u',
  dataset: 'production',
  apiVersion: '2022-08-22',
  useCdn: false,
};
export const sanityClient = createClient(config);
export const usePreviewSubscription = createPreviewSubscriptionHook(config);
export const urlFor = (source) => imageUrlBuilder(config).image(source);
export const PortableText = (props) => (
  <PortableTextComponent components={{ block: {} }} {...props} />
);
