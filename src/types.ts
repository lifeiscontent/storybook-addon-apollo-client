import type {
  MockedResponse,
  MockedProviderProps,
} from "@apollo/client/testing";

export type ApolloClientAddonState = {
  mocks: MockedResponse[];
  queries: string[];
};

export type ApolloClientParameters = {
  apolloClient?: Partial<Omit<MockedProviderProps, "children">>;
};
