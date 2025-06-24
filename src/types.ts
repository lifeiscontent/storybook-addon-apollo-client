import { MockedProviderProps, MockedResponse } from "@apollo/client/testing";

export type ApolloClientAddonState = {
  mocks: MockedResponse[];
  queries: string[];
};

export interface ApolloClientTypes {
  parameters: {
    apolloClient?: ApolloClientParameters;
  };
}

export type ApolloClientParameters = Partial<
  Omit<MockedProviderProps, "children">
>;
