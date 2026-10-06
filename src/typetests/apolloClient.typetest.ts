/**
 * Type tests for the `apolloClient` parameter. `pnpm typecheck` runs them.
 * Each `@ts-expect-error` line must stay an error. If a type gets too loose,
 * the directive is not used and the check fails.
 */
import { MockedProvider as MockedProviderV4 } from '@apollo/client/testing/react';
import { MockedProvider as MockedProviderV3, type MockedResponse as MockedResponseV3 } from '@apollo/client-v3/testing';
import { gql } from '@apollo/client';
import { definePreview } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import apolloClient from '../index';
import apolloClientCore from '../core';
import { MockLink } from '@apollo/client/testing';

const QUERY = gql`
  query Viewer {
    viewer {
      id
    }
  }
`;

function Component() {
  return null;
}

declare const BadMockedProvider: ComponentType<{ mocks: string }>;

// Apollo Client 4
{
  const preview = definePreview({ addons: [apolloClient({ MockedProvider: MockedProviderV4 })] });
  const meta = preview.meta({
    component: Component,
    parameters: {
      apolloClient: {
        mocks: [{ request: { query: QUERY }, result: { data: { viewer: null } }, delay: 100 }],
        showWarnings: false,
      },
    },
  });

  meta.story({
    parameters: {
      apolloClient: {
        // Apollo Client 4 accepts a function to match variables.
        mocks: [{ request: { query: QUERY, variables: () => true }, result: { data: {} } }],
      },
    },
  });

  meta.story({
    parameters: {
      // @ts-expect-error `mocks` must be an array of mocked responses.
      apolloClient: { mocks: 'not an array' },
    },
  });

  meta.story({
    parameters: {
      apolloClient: {
        // @ts-expect-error A mock must have a request.
        mocks: [{ result: { data: {} } }],
      },
    },
  });

  meta.story({
    parameters: {
      apolloClient: {
        // @ts-expect-error `addTypename` was removed in Apollo Client 4.
        addTypename: false,
      },
    },
  });

  meta.story({
    parameters: {
      // @ts-expect-error `children` comes from the story, not the parameter.
      apolloClient: { children: null },
    },
  });

  // Other parameters stay open.
  meta.story({ parameters: { layout: 'centered' } });

  const mocks: MockLink.MockedResponse[] = [{ request: { query: QUERY }, result: { data: {} } }];
  meta.story({ parameters: { apolloClient: { mocks } } });
}

// Apollo Client 3
{
  const preview = definePreview({ addons: [apolloClient({ MockedProvider: MockedProviderV3 })] });
  const meta = preview.meta({ component: Component });

  const mocks: MockedResponseV3[] = [{ request: { query: QUERY }, result: { data: {} } }];
  meta.story({ parameters: { apolloClient: { mocks, addTypename: false } } });

  meta.story({
    parameters: {
      // @ts-expect-error `localState` is an Apollo Client 4 option.
      apolloClient: { localState: undefined },
    },
  });
}

// The addon needs a MockedProvider.
{
  // @ts-expect-error The options argument is required.
  apolloClient();

  // @ts-expect-error The component must accept `mocks`.
  apolloClient({ MockedProvider: BadMockedProvider });
}

// Core addon for other renderers
{
  const preview = definePreview({ addons: [apolloClientCore<{ mocks?: MockLink.MockedResponse[] }>()] });
  const meta = preview.meta({ component: Component });

  meta.story({ parameters: { apolloClient: { mocks: [{ request: { query: QUERY } }] } } });

  meta.story({
    parameters: {
      // @ts-expect-error The core addon only knows the options that you give it.
      apolloClient: { showWarnings: false },
    },
  });

  const untyped = definePreview({ addons: [apolloClientCore()] });
  untyped.meta({ component: Component }).story({
    parameters: { apolloClient: { mocks: [{ request: { query: QUERY } }] } },
  });
}
