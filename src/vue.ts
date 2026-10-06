import { DefaultApolloClient } from '@vue/apollo-composable';
import type { DecoratorFunction } from 'storybook/internal/types';
import { defineComponent, h, provide, type Component } from 'vue';
import { defineApolloClientAddon } from './defineApolloClientAddon';
import type { ApolloClientAddonOptions, ApolloClientParameters, CheckMocks } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

export type {
  ApolloClientAddonOptions,
  ApolloClientInstance,
  ApolloClientOptionsLike,
  ApolloClientParameters,
  ApolloClientTypes,
  MockedResponseLike,
} from './types';
export { withApolloClientPanel };

/**
 * Makes a decorator that gives each story with an `apolloClient` parameter
 * the client that `createClient` makes, through `@vue/apollo-composable`.
 * Stories without the parameter are not changed.
 */
export function withApolloClient<TOptions extends object>(
  createClient: ApolloClientAddonOptions<TOptions>['createClient'],
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
        // setup runs for each mount, so each story gets a new cache and new mocks.
        provide(DefaultApolloClient, createClient(apolloClient));
        return () => h(story);
      },
    });
  };
}

/**
 * The Apollo Client addon for Vue 3 with `@vue/apollo-composable`.
 *
 * @example
 * // Apollo Client 3, which @vue/apollo-composable supports
 * import { ApolloClient, InMemoryCache } from '@apollo/client/core';
 * import { MockLink, type MockedResponse } from '@apollo/client/testing/core';
 *
 * definePreview({
 *   addons: [
 *     apolloClient({
 *       createClient: ({ mocks = [] }: { mocks?: ReadonlyArray<MockedResponse> }) =>
 *         new ApolloClient({ cache: new InMemoryCache(), link: new MockLink(mocks) }),
 *     }),
 *   ],
 * });
 */
export default function apolloClient<TOptions extends object>(
  options: ApolloClientAddonOptions<TOptions> & CheckMocks<TOptions>,
) {
  return defineApolloClientAddon('storybook-addon-apollo-client/vue', options, withApolloClient);
}
