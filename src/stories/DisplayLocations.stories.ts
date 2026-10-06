import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';

import { DisplayLocations, GET_LOCATIONS_QUERY } from './DisplayLocations';

const locations = Array.from({ length: 3 }).map((_, index) => ({
  id: index + 1,
  name: `Location ${index + 1}`,
  description: 'This is a location',
  photo: 'https://placehold.co/400x250',
  __typename: 'Location',
}));

const meta = preview.meta({
  title: 'Example/DisplayLocations',
  component: DisplayLocations,
  tags: ['autodocs'],
});

export const WithResponse = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATIONS_QUERY,
          },
          result: {
            data: { locations },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findAllByRole('heading')).toHaveLength(locations.length);
  },
});

export const WithDelayedResponse = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          delay: 1000,
          request: {
            query: GET_LOCATIONS_QUERY,
          },
          result: {
            data: { locations },
          },
        },
      ],
    },
  },
});

export const WithError = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATIONS_QUERY,
          },
          error: new Error('Could not get locations'),
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Error : Could not get locations')).toBeInTheDocument();
  },
});
