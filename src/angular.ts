import { inject, NgZone } from '@angular/core';
import { Apollo } from 'apollo-angular';
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

interface AngularStoryResult {
  applicationConfig?: { providers?: unknown[] };
}

/**
 * Makes a decorator that gives each story with an `apolloClient` parameter
 * the client that `createClient` makes, through the `Apollo` service of
 * `apollo-angular`. Stories without the parameter are not changed.
 */
export function withApolloClient<TOptions extends object>(
  createClient: ApolloClientAddonOptions<TOptions>['createClient'],
): DecoratorFunction {
  return (storyFn, context) => {
    const { apolloClient } = context.parameters as ApolloClientParameters<TOptions>;
    const story = storyFn() as AngularStoryResult;

    if (!apolloClient) {
      return story;
    }

    // Angular starts a new application for each story, so each story gets a
    // new cache and new mocks.
    const provideApolloClient = {
      provide: Apollo,
      useFactory: () => {
        const apollo = new Apollo(inject(NgZone));
        apollo.client = createClient(apolloClient) as Apollo['client'];
        return apollo;
      },
    };

    return {
      ...story,
      applicationConfig: {
        ...story.applicationConfig,
        providers: [...(story.applicationConfig?.providers ?? []), provideApolloClient],
      },
    };
  };
}

/**
 * The Apollo Client addon for Angular with `apollo-angular`.
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
  return defineApolloClientAddon('storybook-addon-apollo-client/angular', options, withApolloClient);
}
