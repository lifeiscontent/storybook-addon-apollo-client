import React from 'react';
import { StoryFn, StoryContext } from '@storybook/addons';
import { PARAM_KEY } from './constants';

export const withApolloClient = (
  storyFn: StoryFn,
  context: StoryContext
): JSX.Element => {
  const { MockedProvider, ...providerProps } =
    context.parameters[PARAM_KEY] ?? {};

  if (!MockedProvider) {
    console.warn(
      'storybook-addon-apollo-client: MockedProvider is missing from parameters in preview.js'
    );

    return storyFn() as JSX.Element;
  }

  return (
    <MockedProvider {...providerProps}>
      {storyFn(context) as JSX.Element}
    </MockedProvider>
  );
};
