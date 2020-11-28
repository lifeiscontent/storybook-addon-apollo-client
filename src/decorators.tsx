import React from 'react';
import { StoryFn, StoryContext } from '@storybook/addons';
import { PARAM_KEY } from './constants';

export const withApolloClient = (
  storyFn: StoryFn,
  context: StoryContext
): JSX.Element => {
  const { Provider, ...providerProps } = context.parameters[PARAM_KEY] || {};

  if (!Provider) {
    console.warn(
      'storybook-addon-apollo-client: Provider is missing from params'
    );

    return storyFn() as JSX.Element;
  }

  return (
    <Provider {...providerProps}>{storyFn(context) as JSX.Element}</Provider>
  );
};
