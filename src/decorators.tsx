import React, { FC } from 'react';
import { StoryContext } from '@storybook/addons';
import { PARAM_KEY } from './constants';

export const withApolloClient = (
  Story: FC<unknown>,
  context: StoryContext
): JSX.Element => {
  const { MockedProvider, ...providerProps } =
    context.parameters[PARAM_KEY] ?? {};

  if (!MockedProvider) {
    console.warn(
      'storybook-addon-apollo-client: MockedProvider is missing from parameters in preview.js'
    );

    return <Story />;
  }

  return (
    <MockedProvider {...providerProps}>
      <Story />
    </MockedProvider>
  );
};
