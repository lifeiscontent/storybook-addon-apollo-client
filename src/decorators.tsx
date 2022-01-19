import { FC } from 'react';
import { PARAM_KEY, ADDON_ID } from './constants';
import { useGlobals, useEffect, useParameter } from '@storybook/addons';
import { print } from 'graphql';
import type { Parameters } from './types';

export const WithApolloClient = (story: any): JSX.Element => {
  const { MockedProvider, ...providerProps } = useParameter<
    Partial<Parameters>
  >(PARAM_KEY, {}) as Partial<Parameters>;
  const { mocks = [] } = providerProps ?? {};
  const [, setGlobals] = useGlobals();

  useEffect(() => {
    setGlobals({
      [`${ADDON_ID}/queries`]: mocks.map((mock) => print(mock.request.query)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!MockedProvider) {
    console.warn(
      'storybook-addon-apollo-client: MockedProvider is missing from parameters in preview.js'
    );

    return story();
  }

  return (
    <MockedProvider {...providerProps}>
      {story()}
    </MockedProvider>
  );
};
