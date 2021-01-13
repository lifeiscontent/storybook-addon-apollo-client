import React, { FC } from 'react';
import { StoryContext } from '@storybook/addons';
import { PARAM_KEY } from './constants';
import { useArgs, useEffect } from '@storybook/addons';
import { ASTNode, print } from 'graphql';

export const WithApolloClient = (
  Story: FC<unknown>,
  context: StoryContext
): JSX.Element => {
  const { MockedProvider, ...providerProps } =
    context.parameters[PARAM_KEY] ?? {};
  const { mocks = [] } = providerProps ?? {};

  const [, updateArgs] = useArgs();
  useEffect(() => {
    updateArgs({
      __APOLLO_CLIENT__: mocks.map((mock: { request: { query: ASTNode } }) =>
        print(mock.request.query)
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
