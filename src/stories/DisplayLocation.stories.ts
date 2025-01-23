import type { Meta, StoryObj } from "@storybook/react";

import { DisplayLocation, GET_LOCATION_QUERY } from "./DisplayLocation";
import { ApolloError } from "@apollo/client";

const meta: Meta<typeof DisplayLocation> = {
  title: "Example/DisplayLocation",
  component: DisplayLocation,
  args: {
    locationId: 1,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DisplayLocation>;

export const WithResponse: Story = {
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
            data: {
              location: {
                id: 1,
                name: "Location 1",
                description: "This is a location",
                photo: "https://placehold.co/400x250",
                __typename: "Location",
              },
            },
          },
        },
      ],
    },
  },
};

export const WithDelayedResponse: Story = {
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
            data: {
              location: {
                id: 1,
                name: "Location 1",
                description: "This is a location",
                photo: "https://placehold.co/400x250",
                __typename: "Location",
              },
            },
          },
        },
      ],
    },
  },
};

export const WithError: Story = {
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
          error: new ApolloError({ errorMessage: "Could not get location" }),
        },
      ],
    },
  },
};
