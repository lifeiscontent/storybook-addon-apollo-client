import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import type { Preview } from '@storybook/react-vite';
import { print } from 'graphql';
import React, { useEffect } from 'react';
import { addons } from 'storybook/internal/preview-api';
import { EVENTS } from '../src';
import type { ApolloClientAddonState } from '../src';

const getMockName = (mockedResponse: MockedResponse) => {
  if (mockedResponse.request.operationName) {
    return mockedResponse.request.operationName;
  }

  const operationDefinition = mockedResponse.request.query.definitions.find(
    (definition) => definition.kind === 'OperationDefinition',
  );

  if (operationDefinition?.name) {
    return operationDefinition.name.value;
  }

  return `Unnamed`;
};

function stringifyOrUndefined(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return undefined;
  }
}

function createResultFromMocks(mocks: MockedResponse[], activeIndex: number): ApolloClientAddonState {
  const mock = mocks[activeIndex];
  if (!mock) {
    return {
      activeIndex: -1,
      options: mocks.map(getMockName),
      query: undefined,
      variables: undefined,
      extensions: undefined,
      context: undefined,
      result: undefined,
      error: undefined,
    };
  }
  return {
    options: mocks.map(getMockName),
    activeIndex: activeIndex,
    query: print(mock.request.query),
    variables: stringifyOrUndefined(mock.request.variables),
    extensions: stringifyOrUndefined(mock.request.extensions),
    context: stringifyOrUndefined(mock.request.context),
    result: stringifyOrUndefined(mock.result),
    error: stringifyOrUndefined(mock.error),
  };
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      useEffect(() => {
        const { mocks = [] } = context.parameters.apolloClient || {};
        const channel = addons.getChannel();

        const handleRequest = (activeIndex: number) => {
          const state = createResultFromMocks(mocks, activeIndex);
          channel.emit(EVENTS.RESULT, state);
        };

        // Emit initial state
        handleRequest(-1);

        channel.on(EVENTS.REQUEST, handleRequest);

        return () => {
          channel.off(EVENTS.REQUEST, handleRequest);
        };
      }, [context.parameters.apolloClient]);

      if (!context.parameters.apolloClient) {
        return <Story />;
      }

      return (
        <MockedProvider {...context.parameters.apolloClient}>
          <Story />
        </MockedProvider>
      );
    },
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
};

export default preview;
