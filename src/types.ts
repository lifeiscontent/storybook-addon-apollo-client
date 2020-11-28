import type { ComponentPropsWithoutRef } from 'react';
import type { MockedProvider } from '@apollo/client/testing';
export type { MockedResponse } from '@apollo/client/testing';

export type Parameters = ComponentPropsWithoutRef<typeof MockedProvider> | undefined;
