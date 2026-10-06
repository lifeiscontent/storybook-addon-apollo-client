import { DefaultApolloClient } from '@vue/apollo-composable';
import { definePreviewAddon } from 'storybook/internal/csf';
import type { DecoratorFunction } from 'storybook/internal/types';
import { defineComponent, h, provide, type Component } from 'vue';
import type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

export * from './constants';
export * from './state';
export * from './types';
export { withApolloClientPanel };

export interface ApolloClientAddonOptions<TOptions extends ApolloClientOptionsLike> {
  /**
   * Makes the Apollo Client for a story from its `apolloClient` parameter.
   * The addon calls it each time that the story mounts, so each story gets
   * a new cache and new mocks.
   */
  createClient: (options: TOptions) => object;
}

/**
 * Makes a decorator that gives the story an Apollo Client through
 * `@vue/apollo-composable`. Stories without the `apolloClient` parameter are
 * not changed.
 */
export function withApolloClient<TOptions extends ApolloClientOptionsLike>(
  createClient: (options: TOptions) => object,
): DecoratorFunction {
  return (storyFn, context) => {
    const { apolloClient } = context.parameters as ApolloClientParameters<TOptions>;
    const story = storyFn() as Component;

    if (!apolloClient) {
      return story;
    }

    return defineComponent({
      name: 'ApolloClientProvider',
      setup() {
        provide(DefaultApolloClient, createClient(apolloClient));
        return () => h(story);
      },
    });
  };
}

/**
 * The Apollo Client addon for Vue 3 with `@vue/apollo-composable`.
 * The type of the `apolloClient` parameter is the parameter type of
 * `createClient`.
 *
 * @example
 * // Apollo Client 3, which @vue/apollo-composable supports
 * import { ApolloClient, InMemoryCache } from '@apollo/client/core';
 * import { MockLink, type MockedResponse } from '@apollo/client/testing/core';
 *
 * definePreview({
 *   addons: [
 *     apolloClient({
 *       createClient: ({ mocks = [] }: { mocks?: MockedResponse[] }) =>
 *         new ApolloClient({ cache: new InMemoryCache(), link: new MockLink(mocks) }),
 *     }),
 *   ],
 * });
 */
export default function apolloClient<TOptions extends ApolloClientOptionsLike>(
  options: ApolloClientAddonOptions<TOptions>,
) {
  if (!options?.createClient) {
    throw new Error(
      'storybook-addon-apollo-client/vue: give a createClient function to the addon, for example apolloClient({ createClient }).',
    );
  }

  return definePreviewAddon<ApolloClientTypes<TOptions>>({
    decorators: [withApolloClient(options.createClient), withApolloClientPanel],
  });
}
