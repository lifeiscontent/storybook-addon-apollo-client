import { useParameter } from '@storybook/manager-api';
import { PARAM_KEY } from './constants';
import { Parameters } from './types';

export function Title() {
  const { mocks = [] } = useParameter<Parameters>(PARAM_KEY, {
    mocks: [],
  });

  return (
    <>{mocks.length ? `Apollo Client (${mocks.length})` : 'Apollo Client'}</>
  );
}
