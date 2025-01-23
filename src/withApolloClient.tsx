import React from 'react';

import { useChannel } from "storybook/internal/preview-api";
import { EVENTS, PARAM_KEY } from "./constants";
import { print } from "graphql";
import { MockedProvider } from "@apollo/client/testing";
import { Decorator } from "@storybook/react";

export const withApolloClient: Decorator = (Story, context) => {
  const props = context.parameters[PARAM_KEY];

  const emit = useChannel({
    [EVENTS.REQUEST]: () => {
      emit(EVENTS.RESULT, {
        mocks: props?.mocks ?? [],
        queries: props?.mocks?.map((mock) => print(mock.request.query)) ?? [],
      });
    },
    [EVENTS.CLEAR]: () => {
      emit(EVENTS.RESULT, {
        mocks: [],
        queries: [],
      });
    },
  });

  if (!props) {
    return <Story />;
  }

  return (
    <MockedProvider {...props}>
      <Story />
    </MockedProvider>
  );
};
