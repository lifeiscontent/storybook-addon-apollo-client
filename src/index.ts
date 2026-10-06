import { createElement, type ComponentType } from 'react';
import { definePreviewAddon } from 'storybook/internal/csf';
import type { DecoratorFunction } from 'storybook/internal/types';
import type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes } from './types';
import { withApolloClientPanel } from './withApolloClientPanel';

export type { ApolloClientOptionsLike, ApolloClientParameters, ApolloClientTypes, MockedResponseLike } from './types';
export { withApolloClientPanel };

/** The `apolloClient` parameter for a `MockedProvider` with props `TProps`. */
export type MockedProviderOptions<TProps> = Omit<TProps, 'children'>;

export interface ApolloClientAddonOptions<TProps extends ApolloClientOptionsLike> {
  /**
   * The `MockedProvider` from your Apollo Client version:
   * `@apollo/client/testing/react` for Apollo Client 4, or
   * `@apollo/client/testing` for Apollo Client 3.
   */
  MockedProvider: ComponentType<TProps>;
}

/**
 * Makes a decorator that puts the story in `MockedProvider` with the
 * `apolloClient` parameter as props. Stories without the parameter are not
 * changed.
 */
export function withMockedProvider<TProps extends ApolloClientOptionsLike>(
  MockedProvider: ComponentType<TProps>,
): DecoratorFunction {
  return function mockedProviderDecorator(Story, context) {
    const { apolloClient } = context.parameters as ApolloClientParameters<TProps>;

    if (!apolloClient) {
      return createElement(Story as ComponentType);
    }

    return createElement(MockedProvider, apolloClient, createElement(Story as ComponentType));
  };
}

/**
 * The Apollo Client addon. Give it the `MockedProvider` from your Apollo
 * Client version. The addon puts each story that has an `apolloClient`
 * parameter in that provider, and the parameter gets the provider's props
 * type.
 *
 * @example
 * import { MockedProvider } from '@apollo/client/testing/react';
 * definePreview({ addons: [apolloClient({ MockedProvider })] });
 */
export default function apolloClient<TProps extends ApolloClientOptionsLike>(
  options: ApolloClientAddonOptions<TProps>,
) {
  if (!options?.MockedProvider) {
    throw new Error(
      'storybook-addon-apollo-client: give your MockedProvider to the addon, for example apolloClient({ MockedProvider }). For renderers other than React, import the addon from "storybook-addon-apollo-client/core".',
    );
  }

  return definePreviewAddon<ApolloClientTypes<MockedProviderOptions<TProps>>>({
    decorators: [withMockedProvider(options.MockedProvider), withApolloClientPanel],
  });
}
