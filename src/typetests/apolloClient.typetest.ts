/**
 * Type tests for the `apolloClient` parameter. `pnpm typecheck` runs them.
 * Each `@ts-expect-error` line must stay an error. If a type gets too loose,
 * the directive is not used and the check fails.
 *
 * These tests use Apollo Client 4. With Apollo Client 3 the parameter types
 * are the same, because the parameter type is the argument type of your own
 * createClient function.
 */
import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { MockLink } from '@apollo/client/testing';
import { definePreview } from '@storybook/react-vite';
import apolloClientAngular from '../angular';
import apolloClientCore from '../core';
import apolloClient from '../index';
import apolloClientVue from '../vue';

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

interface MockOptions {
  mocks?: ReadonlyArray<MockLink.MockedResponse>;
}

const createClient = ({ mocks = [] }: MockOptions) =>
  new ApolloClient({ cache: new InMemoryCache(), link: new MockLink(mocks) });

// React
{
  const preview = definePreview({ addons: [apolloClient({ createClient })] });
  const meta = preview.meta({
    component: Component,
    parameters: {
      apolloClient: {
        mocks: [{ request: { query: QUERY }, result: { data: { viewer: null } }, delay: 100 }],
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
      // @ts-expect-error The parameter only has the options that createClient takes.
      apolloClient: { showWarnings: false },
    },
  });

  // Other parameters stay open.
  meta.story({ parameters: { layout: 'centered' } });
}

// Options without mocks, for example for a client with local resolvers
{
  const preview = definePreview({
    addons: [
      apolloClient({
        createClient: ({ viewerName }: { viewerName: string }) =>
          new ApolloClient({
            cache: new InMemoryCache(),
            link: new MockLink([]),
            dataMasking: false,
            defaultOptions: { query: { context: { viewerName } } },
          }),
      }),
    ],
  });
  const meta = preview.meta({ component: Component });

  meta.story({ parameters: { apolloClient: { viewerName: 'Ada' } } });

  meta.story({
    parameters: {
      // @ts-expect-error `viewerName` must be a string.
      apolloClient: { viewerName: 1 },
    },
  });
}

// The addon needs a createClient function that returns a client.
{
  // @ts-expect-error The options argument is required.
  apolloClient();

  // @ts-expect-error createClient must return a client, not client options.
  apolloClient({ createClient: () => ({ cache: new InMemoryCache() }) });

  // @ts-expect-error `mocks` must be compatible with the mocks that the panel reads.
  apolloClient({ createClient: (options: { mocks: string }) => createClient({ mocks: [] }) ?? options });
}

// Vue and Angular take the same options.
{
  for (const addon of [apolloClientVue({ createClient }), apolloClientAngular({ createClient })]) {
    const meta = definePreview({ addons: [addon] }).meta({ component: Component });

    meta.story({ parameters: { apolloClient: { mocks: [{ request: { query: QUERY }, result: { data: {} } }] } } });

    meta.story({
      parameters: {
        // @ts-expect-error `mocks` must be an array of mocked responses.
        apolloClient: { mocks: 'not an array' },
      },
    });
  }

  // @ts-expect-error The options argument is required.
  apolloClientVue();

  // @ts-expect-error The options argument is required.
  apolloClientAngular();
}

// Core addon for other renderers
{
  const preview = definePreview({ addons: [apolloClientCore<MockOptions>()] });
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
