import { FC } from 'react';
import { EVENTS, PARAM_KEY } from './constants';
import { useParameter, useChannel, useEffect } from '@storybook/addons';
import { print } from 'graphql';
import type { Parameters } from './types';

export const WithApolloClient = (Story: FC<unknown>): JSX.Element => {
  const { MockedProvider, ...providerProps } = useParameter<
    Partial<Parameters>
  >(PARAM_KEY, {}) as Partial<Parameters>;
  const { mocks = [] } = providerProps ?? {};
  const emit = useChannel({}, []);
  useEffect(() => {
    emit(EVENTS.RESULT, {
      activeIndex: mocks.length ? 0 : -1,
      mocks,
      queries: mocks.map((mock) => print(mock.request.query)),
    });
  }, [emit, mocks]);

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
