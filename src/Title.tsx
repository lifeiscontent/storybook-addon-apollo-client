import { useParameter } from 'storybook/manager-api';
import { PARAM_KEY } from './constants';
import type { ApolloClientOptionsLike } from './types';

export function Title() {
  const mocks = useParameter<ApolloClientOptionsLike>(PARAM_KEY)?.mocks;
  const count = Array.isArray(mocks) ? mocks.length : 0;

  return count ? `Apollo Client (${count})` : 'Apollo Client';
}
