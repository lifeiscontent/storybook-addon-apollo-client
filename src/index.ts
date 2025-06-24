import { ApolloClientParameters } from './types';

export { PARAM_KEY } from './constants';
export * from './preview';

declare module 'storybook/internal/csf' {
  interface Parameters {
    apolloClient?: ApolloClientParameters;
  }
}
