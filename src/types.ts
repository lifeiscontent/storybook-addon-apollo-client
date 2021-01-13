export type MockedProviderProps =
  | import('@apollo/client/testing').MockedProviderProps
  | import('@apollo/react-testing').MockedProviderProps;

export type Parameters = MockedProviderProps;