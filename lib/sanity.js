import {
  createClient,
  createPreviewSubscriptionHook,
  createImageUrlBuilder,
  createPortableTextComponent,
} from 'next-sanity';

const config = {
  projectId: '5f8j9l9u',
  dataset: 'production',
  apiVersion: '2022-08-22',
  useCdn: false,
};
export const sanityClient = createClient(config);
export const usePreviewSubscription = createPreviewSubscriptionHook(config);
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
export const portableText = createPortableTextComponent({
  ...config,
  serializers: {},
});
