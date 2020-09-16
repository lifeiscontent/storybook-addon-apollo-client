import { ComponentProps } from 'react';
import { MockedProvider } from '@apollo/client/testing';

type MockedProviderProps = ComponentProps<typeof MockedProvider>;
export type Parameters = MockedProviderProps;

export enum Tabs {
  Request = 'Request',
  Response = 'Response',
}

/* Structure used to build Query List UI */
export type QueryMetadata = {
  data: { [key: string]: any };
  name: string;
  query: string;
  variables: { [key: string]: any };
};
