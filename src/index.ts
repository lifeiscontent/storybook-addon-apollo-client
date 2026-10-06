import { ApolloProvider } from '@apollo/client/react';
import { createElement, useMemo, type ComponentProps, type ComponentType } from 'react';
import type { DecoratorFunction } from 'storybook/internal/types';
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

type CreateClient<TOptions extends object> = ApolloClientAddonOptions<TOptions>['createClient'];

function ApolloClientStory<TOptions extends object>({
  createClient,
  options,
  Story,
}: {
  createClient: CreateClient<TOptions>;
  options: TOptions;
  Story: ComponentType;
}) {
  // A new client for each mount, so each story gets a new cache and new mocks.
  const client = useMemo(() => createClient(options), [createClient, options]);

  // Apollo Client 4 types `children` as a required prop, so the props need a cast.
  const props = { client } as ComponentProps<typeof ApolloProvider>;

  return createElement(ApolloProvider, props, createElement(Story));
}

/**
 * Makes a decorator that gives each story with an `apolloClient` parameter
 * the client that `createClient` makes, through `ApolloProvider`. Stories
 * without the parameter are not changed.
 */
export function withApolloClient<TOptions extends object>(createClient: CreateClient<TOptions>): DecoratorFunction {
  return function apolloClientDecorator(Story, context) {
    const { apolloClient } = context.parameters as ApolloClientParameters<TOptions>;

    if (!apolloClient) {
      return createElement(Story as ComponentType);
    }

    return createElement(ApolloClientStory<TOptions>, {
      key: context.id,
      createClient,
      options: apolloClient,
      Story: Story as ComponentType,
    });
  };
}

/**
 * The Apollo Client addon for React.
 *
 * @example
 * import { ApolloClient, InMemoryCache } from '@apollo/client';
 * import { MockLink } from '@apollo/client/testing';
 *
 * definePreview({
 *   addons: [
 *     apolloClient({
 *       createClient: ({ mocks = [] }: { mocks?: ReadonlyArray<MockLink.MockedResponse> }) =>
 *         new ApolloClient({ cache: new InMemoryCache(), link: new MockLink(mocks) }),
 *     }),
 *   ],
 * });
 */
export default function apolloClient<TOptions extends object>(
  options: ApolloClientAddonOptions<TOptions> & CheckMocks<TOptions>,
) {
  return defineApolloClientAddon('storybook-addon-apollo-client', options, withApolloClient);
}
