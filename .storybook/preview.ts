import { MockedProvider } from '@apollo/client/testing/react';
import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/react-vite';
import apolloClient from '../src';

export default definePreview({
  addons: [addonDocs(), apolloClient({ MockedProvider })],
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
