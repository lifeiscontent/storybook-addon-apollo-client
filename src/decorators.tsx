import React, { FC } from 'react';
import { PARAM_KEY, ADDON_ID } from './constants';
import { useGlobals, useEffect, useParameter } from '@storybook/addons';
import { print } from 'graphql';
import type { Parameters } from './types';

export const WithApolloClient = (Story: FC<unknown>): JSX.Element => {
  const { MockedProvider, ...providerProps } = useParameter<
    Partial<Parameters>
  >(PARAM_KEY, {}) as Partial<Parameters>;
  const { mocks = [] } = providerProps ?? {};
  const [, setGlobals] = useGlobals();

  useEffect(() => {
    setGlobals({
      [`${ADDON_ID}/queries`]: mocks.map((mock) => print(mock.request.query)),
    });
  }, [mocks, setGlobals]);

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
