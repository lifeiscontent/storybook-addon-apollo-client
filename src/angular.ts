import { provideApollo } from 'apollo-angular';
import { definePreviewAddon } from 'storybook/internal/csf';
import type { DecoratorFunction } from 'storybook/internal/types';
import type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

export type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes, MockedResponseLike } from './types';
export { withApolloClientPanel };

/** The options that `provideApollo` from `apollo-angular` uses to make the client. */
export type ApolloAngularClientOptions = ReturnType<Parameters<typeof provideApollo>[0]>;

export interface ApolloClientAddonOptions<TOptions extends ApolloClientOptionsLike> {
  /**
   * Makes the Apollo Client options for a story from its `apolloClient`
   * parameter. `apollo-angular` makes a new client from them each time that
   * the story starts, so each story gets a new cache and new mocks.
   */
  createOptions: (options: TOptions) => ApolloAngularClientOptions;
}

interface AngularStoryResult {
  applicationConfig?: { providers?: unknown[] };
}

/**
 * Makes a decorator that adds `provideApollo` to the application providers
 * of each story that has the `apolloClient` parameter. Other stories are not
 * changed.
 */
export function withApolloClient<TOptions extends ApolloClientOptionsLike>(
  createOptions: (options: TOptions) => ApolloAngularClientOptions,
): DecoratorFunction {
  return (storyFn, context) => {
    const { apolloClient } = context.parameters as ApolloClientParameters<TOptions>;
    const story = storyFn() as AngularStoryResult;

    if (!apolloClient) {
      return story;
    }

    return {
      ...story,
      applicationConfig: {
        ...story.applicationConfig,
        providers: [...(story.applicationConfig?.providers ?? []), provideApollo(() => createOptions(apolloClient))],
      },
    };
  };
}

/**
 * The Apollo Client addon for Angular with `apollo-angular`.
 * The type of the `apolloClient` parameter is the parameter type of
 * `createOptions`.
 *
 * @example
 * import { InMemoryCache } from '@apollo/client';
 * import { MockLink } from '@apollo/client/testing';
 *
 * definePreview({
 *   addons: [
 *     apolloClient({
 *       createOptions: ({ mocks = [] }: { mocks?: MockLink.MockedResponse[] }) => ({
 *         cache: new InMemoryCache(),
 *         link: new MockLink(mocks),
 *       }),
 *     }),
 *   ],
 * });
 */
export default function apolloClient<TOptions extends ApolloClientOptionsLike>(
  options: ApolloClientAddonOptions<TOptions>,
) {
  if (!options?.createOptions) {
    throw new Error(
      'storybook-addon-apollo-client/angular: give a createOptions function to the addon, for example apolloClient({ createOptions }).',
    );
  }

  return definePreviewAddon<ApolloClientTypes<TOptions>>({
    decorators: [withApolloClient(options.createOptions), withApolloClientPanel],
  });
}
