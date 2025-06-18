import type { Meta, StoryObj } from "@storybook/react-vite";

import { DisplayLocation, GET_LOCATION_QUERY } from "./DisplayLocation";
import { ApolloError } from "@apollo/client";
import { expect, fn, within } from "storybook/test";
import { MockedResponse } from "@apollo/client/testing";

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

export const WithVariableMatcher: Story = {
  parameters: {
    apolloClient: {
      mocks: [
        {
          request: {
            query: GET_LOCATION_QUERY,
          },
          variableMatcher: fn(() => true),
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
  play: async ({ parameters, canvasElement }) => {
    const canvas = within(canvasElement);
    const mock = parameters.apolloClient!.mocks![0]!;
    await expect(
      // @ts-expect-error - storybook types are wrong
      canvas.getByRole("heading", { name: mock.result.data.location.name }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("img", { name: "location-reference" }),
      // @ts-expect-error - storybook types are wrong
    ).toHaveAttribute("src", mock.result.data.location.photo);
    await expect(
      // @ts-expect-error - storybook types are wrong
      canvas.getByText(mock.result.data.location.description),
    ).toBeInTheDocument();
    await expect(mock.variableMatcher).toHaveBeenCalledWith({ locationId: 1 });
  },
};
