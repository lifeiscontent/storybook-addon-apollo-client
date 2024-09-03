import type { Meta, StoryObj } from "@storybook/react";

import { DisplayLocations, GET_LOCATIONS_QUERY } from "./DisplayLocations";
import { GET_LOCATION_QUERY } from "./DisplayLocation";
import { ApolloError } from "@apollo/client";

const meta: Meta<typeof DisplayLocations> = {
  title: "Example/DisplayLocations",
  component: DisplayLocations,
  args: {
    locationId: 1,
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DisplayLocations>;

export const WithResponse: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATIONS_QUERY,
          },
          result: {
            data: {
              locations: Array.from({ length: 3 }).map((_, index) => ({
                id: index + 1,
                name: `Location ${index + 1}`,
                description: "This is a location",
                photo: "https://via.placeholder.com/400x250",
                __typename: "Location",
              })),
            },
          },
        },
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
                photo: "https://via.placeholder.com/400x250",
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
            query: GET_LOCATIONS_QUERY,
          },
          result: {
            data: {
              locations: Array.from({ length: 3 }).map((_, index) => ({
                id: index + 1,
                name: `Location ${index + 1}`,
                description: "This is a location",
                photo: "https://via.placeholder.com/400x250",
                __typename: "Location",
              })),
            },
          },
        },
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
                photo: "https://via.placeholder.com/400x250",
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
            query: GET_LOCATIONS_QUERY,
          },
          error: new ApolloError({ errorMessage: "Could not get locations" }),
        },
      ],
    },
  },
};

export const WithVariableMatcher: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATIONS_QUERY,
          },
          variableMatcher: (variables) => !variables.locationId,
          result: {
            data: {
              locations: Array.from({ length: 3 }).map((_, index) => ({
                id: index + 1,
                name: `Location ${index + 1}`,
                description: "This is a location",
                photo: "https://via.placeholder.com/400x250",
                __typename: "Location",
              })),
            },
          },
        },
        {
          request: {
            query: GET_LOCATION_QUERY,
          },
          variableMatcher: (variables) => variables.locationId === 1,
          result: {
            data: {
              location: {
                id: 1,
                name: "Location 1",
                description: "This is a location",
                photo: "https://via.placeholder.com/400x250",
                __typename: "Location",
              },
            },
          },
        },
      ],
    },
  },
};
