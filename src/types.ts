import type {
  MockedResponse,
  MockedProviderProps,
} from "@apollo/client/testing";

export type ApolloAddonState = {
  mocks: MockedResponse[];
  queries: string[];
};

export type ApolloParameters = {
  apolloClient?: Partial<Omit<MockedProviderProps, "children">>;
};
