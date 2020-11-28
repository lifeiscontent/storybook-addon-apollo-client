export type MockedProviderProps =
  | import('@apollo/client/testing').MockedProviderProps
  | import('@apollo/react-testing').MockedProviderProps;

export type Parameters = MockedProviderProps;

export type MockedResponse =
  | import('@apollo/client/testing').MockedResponse
  | import('@apollo/react-testing').MockedResponse;
