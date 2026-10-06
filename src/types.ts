import type { DocumentNode } from 'graphql';

export type ApolloClientAddonState = {
  options: string[];
  variables?: string;
  query?: string;
  extensions?: string;
  context?: string;
  result?: string;
  error?: string;
  /** The `delay` and `maxUsageCount` of the mock. */
  mockOptions?: string;
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
    /** Apollo Client 3 only. */
    extensions?: unknown;
    /** Apollo Client 3 only. */
    context?: unknown;
  };
  result?: unknown;
  error?: unknown;
  delay?: unknown;
  maxUsageCount?: number;
  /** Apollo Client 3 only. Apollo Client 4 accepts a function in `request.variables`. */
  variableMatcher?: unknown;
}

/** The smallest set of options that the `apolloClient` parameter accepts. */
export interface ApolloClientOptionsLike {
  mocks?: ReadonlyArray<MockedResponseLike>;
}

export type ApolloClientParameters<TOptions = ApolloClientOptionsLike> = {
  /**
   * The mocked Apollo Client for this story. Put your mocks in `mocks`.
   * The addon gives the story a client with these options, and shows the
   * mocks in the Apollo Client panel.
   *
   * The type comes from the addon in `definePreview`: the props of your
   * `MockedProvider` (React), the argument of `createClient` (Vue), or the
   * argument of `createOptions` (Angular).
   *
   * @see https://github.com/lifeiscontent/storybook-addon-apollo-client#writing-your-stories-with-queries
   */
  apolloClient?: TOptions;
};

/** The types that the addon adds to `definePreview` through `addons: [...]`. */
export interface ApolloClientTypes<TOptions = ApolloClientOptionsLike> {
  parameters: ApolloClientParameters<TOptions>;
}
