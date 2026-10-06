import { definePreviewAddon, type PreviewAddon } from 'storybook/internal/csf';
import type { DecoratorFunction } from 'storybook/internal/types';
import type { ApolloClientAddonOptions, ApolloClientTypes } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

/**
 * Makes the addon for one framework. `withApolloClient` is the decorator that
 * gives the client to the story in that framework.
 */
export function defineApolloClientAddon<TOptions extends object>(
  entry: string,
  options: ApolloClientAddonOptions<TOptions> | undefined,
  withApolloClient: (createClient: ApolloClientAddonOptions<TOptions>['createClient']) => DecoratorFunction,
): PreviewAddon<ApolloClientTypes<TOptions>> {
  if (typeof options?.createClient !== 'function') {
    throw new Error(
      `${entry}: give a createClient function to the addon, for example apolloClient({ createClient }). See https://github.com/lifeiscontent/storybook-addon-apollo-client#setup`,
    );
  }

  return definePreviewAddon<ApolloClientTypes<TOptions>>({
    decorators: [withApolloClient(options.createClient), withApolloClientPanel],
  });
}
