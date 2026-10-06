import type { DocumentNode } from 'graphql';

export type ApolloClientAddonState = {
  options: string[];
  variables?: string;
  query?: string;
  extensions?: string;
  context?: string;
  result?: string;
  error?: string;
  activeIndex: number;
};

/**
 * The part of a mocked response that the addon panel reads.
 * Both the Apollo Client 3 `MockedResponse` and the Apollo Client 4
 * `MockLink.MockedResponse` satisfy this shape, so the addon does not import
 * either version.
 */
export interface MockedResponseLike {
  request: {
    query: DocumentNode;
    variables?: unknown;
    operationName?: string;
    extensions?: unknown;
    context?: unknown;
  };
  result?: unknown;
  error?: unknown;
}

/** The smallest set of options that the `apolloClient` parameter accepts. */
export interface ApolloClientOptionsLike {
  mocks?: ReadonlyArray<MockedResponseLike>;
}

/**
 * The `apolloClient` parameter. `TOptions` is the props of the
 * `MockedProvider` that you give to the addon, without `children`.
 */
export type ApolloClientParameters<TOptions = ApolloClientOptionsLike> = {
  apolloClient?: TOptions;
};

/** The types that the addon adds to `definePreview` through `addons: [...]`. */
export interface ApolloClientTypes<TOptions = ApolloClientOptionsLike> {
  parameters: ApolloClientParameters<TOptions>;
}
