import type { DecoratorFunction } from 'storybook/internal/types';
import { useChannel, useEffect } from 'storybook/preview-api';
import { EVENTS } from './constants';
import { getApolloClientAddonState } from './state';
import type { ApolloClientParameters, MockedResponseLike } from './types';

// One shared array, so that the hook dependencies do not change on each render.
const NO_MOCKS: ReadonlyArray<MockedResponseLike> = [];

/**
 * Sends the mocks of the current story to the addon panel.
 * It uses the Storybook hooks, so it works with all renderers.
 */
export const withApolloClientPanel: DecoratorFunction = (storyFn, context) => {
  const { apolloClient } = context.parameters as ApolloClientParameters;
  const mocks = apolloClient?.mocks ?? NO_MOCKS;

  const emit = useChannel(
    {
      [EVENTS.REQUEST]: (activeIndex: number) => {
        emit(EVENTS.RESULT, getApolloClientAddonState(mocks, activeIndex));
      },
    },
    [mocks],
  );

  useEffect(() => {
    emit(EVENTS.RESULT, getApolloClientAddonState(mocks, 0));
  }, [mocks]);

  return storyFn();
};
