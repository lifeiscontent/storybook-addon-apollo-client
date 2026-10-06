import { useParameter } from 'storybook/manager-api';
import { PARAM_KEY } from './constants';
import type { ApolloClientOptionsLike } from './types';

export function Title() {
  const count = useParameter<ApolloClientOptionsLike>(PARAM_KEY)?.mocks?.length ?? 0;

  return count ? `Apollo Client (${count})` : 'Apollo Client';
}
