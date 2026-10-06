import { definePreviewAddon } from 'storybook/internal/csf';
import type { ApolloClientOptionsLike, ApolloClientTypes } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

export type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes, MockedResponseLike } from './types';
export { withApolloClientPanel };

/**
 * The addon for renderers other than React. It connects the panel and types
 * the `apolloClient` parameter, but you must supply the Apollo Client
 * provider in your own decorator.
 *
 * @example
 * import type { MockLink } from '@apollo/client/testing';
 * definePreview({ addons: [apolloClient<{ mocks?: MockLink.MockedResponse[] }>()] });
 */
export default function apolloClient<TOptions extends object = ApolloClientOptionsLike>() {
  return definePreviewAddon<ApolloClientTypes<TOptions>>({
    decorators: [withApolloClientPanel],
  });
}
