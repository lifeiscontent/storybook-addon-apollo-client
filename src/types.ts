import type { ApolloClient } from '@apollo/client/core';
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

/** The options that the panel reads from the `apolloClient` parameter. */
export interface ApolloClientOptionsLike {
  mocks?: ReadonlyArray<MockedResponseLike>;
}

/**
 * Gives a type error when the options have a `mocks` property that the panel
 * cannot read. Options without `mocks` are accepted.
 */
export type CheckMocks<TOptions> = 'mocks' extends keyof TOptions
  ? TOptions extends ApolloClientOptionsLike
    ? unknown
    : { 'The mocks option must be an array of mocked responses': never }
  : unknown;

/** An Apollo Client from your Apollo Client version (3 or 4). */
export type ApolloClientInstance = InstanceType<typeof ApolloClient>;

export interface ApolloClientAddonOptions<TOptions extends object = ApolloClientOptionsLike> {
  /**
   * Makes the Apollo Client for a story from its `apolloClient` parameter.
   * The addon calls it each time that the story mounts, so each story gets a
   * new cache and new mocks. The type of the `apolloClient` parameter is the
   * type of the argument of this function.
   */
  createClient: (options: TOptions) => ApolloClientInstance;
}

export type ApolloClientParameters<TOptions = ApolloClientOptionsLike> = {
  /**
   * The mocked Apollo Client for this story. Put your mocks in `mocks`.
   * The addon gives the story the client that `createClient` makes from
   * these options, and shows the mocks in the Apollo Client panel.
   *
   * The type is the type of the argument of `createClient` in
   * `definePreview`.
   *
   * @see https://github.com/lifeiscontent/storybook-addon-apollo-client#writing-your-stories-with-queries
   */
  apolloClient?: TOptions;
};

/** The types that the addon adds to `definePreview` through `addons: [...]`. */
export interface ApolloClientTypes<TOptions = ApolloClientOptionsLike> {
  parameters: ApolloClientParameters<TOptions>;
}
