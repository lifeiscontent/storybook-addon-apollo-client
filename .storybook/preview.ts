import { ApolloClient, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/react-vite';
import apolloClient from '../src';

export default definePreview({
  addons: [
    addonDocs(),
    apolloClient({
      createClient: ({ mocks = [] }: { mocks?: ReadonlyArray<MockLink.MockedResponse> }) =>
        new ApolloClient({ cache: new InMemoryCache(), link: new MockLink(mocks) }),
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  initialGlobals: {
    background: { value: 'light' },
  },
});
