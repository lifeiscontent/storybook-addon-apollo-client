import { useParameter } from '@storybook/api';
import type { Parameters } from './types';
import { PARAM_KEY } from './constants';

export function getTitle(): string {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useParameter<Parameters>(PARAM_KEY);

  return params?.mocks?.length
    ? `Apollo Client (${params.mocks.length})`
    : 'Apollo Client (0)';
}
