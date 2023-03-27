import { useParameter } from '@storybook/api';
import type { Parameters } from './types';
import { PARAM_KEY } from './constants';

export function getTitle(): string {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { mocks = [] } = useParameter<Parameters>(PARAM_KEY, {
    mocks: [],
  });

  return mocks.length ? `Apollo Client (${mocks.length})` : 'Apollo Client (0)';
}
