import { expect, fn } from 'storybook/test';
import preview from '../../.storybook/preview';

import { DisplayLocation, GET_LOCATION_QUERY } from './DisplayLocation';

const location = {
  id: 1,
  name: 'Location 1',
  description: 'This is a location',
  photo: 'https://placehold.co/400x250',
  __typename: 'Location',
};

const meta = preview.meta({
  title: 'Example/DisplayLocation',
  component: DisplayLocation,
  args: {
    locationId: 1,
  },
  tags: ['autodocs'],
});

export const WithResponse = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATION_QUERY,
            variables: {
              locationId: 1,
            },
          },
          result: {
            data: { location },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: location.name })).toBeInTheDocument();
  },
});

export const WithDelayedResponse = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          delay: 1000,
          request: {
            query: GET_LOCATION_QUERY,
            variables: {
              locationId: 1,
            },
          },
          result: {
            data: { location },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
    await expect(await canvas.findByRole('heading', { name: location.name }, { timeout: 3000 })).toBeInTheDocument();
  },
});

export const WithError = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATION_QUERY,
            variables: {
              locationId: 1,
            },
          },
          error: new Error('Could not get location'),
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText('Error : Could not get location')).toBeInTheDocument();
  },
});

/** Several mocks. Select one in the Apollo Client panel to see its details. */
export const WithMultipleMocks = meta.story({
  args: {
    locationId: 2,
  },
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATION_QUERY,
            variables: { locationId: 1 },
          },
          result: {
            data: { location },
          },
        },
        {
          request: {
            query: GET_LOCATION_QUERY,
            variables: { locationId: 2 },
          },
          result: {
            data: { location: { ...location, id: 2, name: 'Location 2' } },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: 'Location 2' })).toBeInTheDocument();
  },
});

const variableMatcher = fn(() => true);

export const WithVariableMatcher = meta.story({
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATION_QUERY,
            variables: variableMatcher,
          },
          result: {
            data: { location },
          },
        },
      ],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('heading', { name: location.name })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'location-reference' })).toHaveAttribute('src', location.photo);
    await expect(canvas.getByText(location.description)).toBeInTheDocument();
    await expect(variableMatcher).toHaveBeenCalledWith({ locationId: 1 });
  },
});
