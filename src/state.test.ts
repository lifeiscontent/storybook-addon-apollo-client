import { CombinedGraphQLErrors, gql, ServerError } from '@apollo/client';
import { describe, expect, it } from 'vitest';
import { formatValue, getApolloClientAddonState } from './state';

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      id
    }
  }
`;

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
    }
  }
`;

describe('formatValue', () => {
  it('returns undefined for undefined, so the panel shows its placeholder', () => {
    expect(formatValue(undefined)).toBeUndefined();
  });

  it('formats plain values as indented JSON', () => {
    expect(formatValue({ id: 1 })).toBe('{\n  "id": 1\n}');
    expect(formatValue(null)).toBe('null');
  });

  it('shows the name and message of an Error', () => {
    expect(JSON.parse(formatValue(new Error('Network down'))!)).toEqual({
      name: 'Error',
      message: 'Network down',
    });
  });

  it('keeps the cause of an Error', () => {
    const error = new Error('Outer', { cause: new TypeError('Inner') });

    expect(JSON.parse(formatValue(error)!)).toEqual({
      name: 'Error',
      message: 'Outer',
      cause: { name: 'TypeError', message: 'Inner' },
    });
  });

  it('keeps the GraphQL errors of a CombinedGraphQLErrors', () => {
    const error = new CombinedGraphQLErrors({ data: null, errors: [{ message: 'Not allowed' }] });

    expect(JSON.parse(formatValue(error)!)).toMatchObject({
      name: 'CombinedGraphQLErrors',
      errors: [{ message: 'Not allowed' }],
    });
  });

  it('keeps the status code of a ServerError', () => {
    const error = new ServerError('Server failed', {
      response: new Response(null, { status: 503 }),
      bodyText: 'Service Unavailable',
    });

    expect(JSON.parse(formatValue(error)!)).toMatchObject({
      name: 'ServerError',
      message: 'Server failed',
      statusCode: 503,
      bodyText: 'Service Unavailable',
    });
  });

  it('shows functions by name, for example a variable matcher', () => {
    function matchViewer() {
      return true;
    }

    expect(formatValue(matchViewer)).toBe('"[Function matchViewer]"');
    expect(JSON.parse(formatValue({ variables: () => true, nested: { fn: matchViewer } })!)).toEqual({
      variables: '[Function variables]',
      nested: { fn: '[Function matchViewer]' },
    });
  });

  it('does not throw for a value that refers to itself', () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(formatValue(value)).toBe('[object Object]');
  });
});

describe('getApolloClientAddonState', () => {
  const mocks = [
    { request: { query: GET_VIEWER, variables: { id: 1 } }, result: { data: { viewer: { id: 1 } } } },
    { request: { query: GET_POSTS }, error: new Error('Failed') },
  ];

  it('lists the operation names and shows the selected mock', () => {
    expect(getApolloClientAddonState(mocks, 1)).toEqual({
      options: ['GetViewer', 'GetPosts'],
      activeIndex: 1,
      query: expect.stringContaining('query GetPosts'),
      variables: undefined,
      extensions: undefined,
      context: undefined,
      result: undefined,
      error: formatValue(new Error('Failed')),
      mockOptions: undefined,
    });
  });

  it('shows delay and maxUsageCount in the mock options', () => {
    const state = getApolloClientAddonState(
      [{ request: { query: GET_VIEWER }, delay: 500, maxUsageCount: Number.POSITIVE_INFINITY }],
      0,
    );

    expect(JSON.parse(state.mockOptions!)).toEqual({ delay: 500, maxUsageCount: 'Infinity' });
  });

  it('shows a delay function by name (Apollo Client 4)', () => {
    function realisticDelay() {
      return 100;
    }

    const state = getApolloClientAddonState([{ request: { query: GET_VIEWER }, delay: realisticDelay }], 0);

    expect(JSON.parse(state.mockOptions!)).toEqual({ delay: '[Function realisticDelay]' });
  });

  it('shows the variableMatcher of an Apollo Client 3 mock as the variables', () => {
    function matchAll() {
      return true;
    }

    const state = getApolloClientAddonState([{ request: { query: GET_VIEWER }, variableMatcher: matchAll }], 0);

    expect(state.variables).toBe('"[Function matchAll]"');
  });

  it('selects nothing when the index is out of range', () => {
    expect(getApolloClientAddonState(mocks, -1)).toEqual({ options: ['GetViewer', 'GetPosts'], activeIndex: -1 });
    expect(getApolloClientAddonState(mocks, 2)).toEqual({ options: ['GetViewer', 'GetPosts'], activeIndex: -1 });
  });

  it('returns no options when there are no mocks', () => {
    expect(getApolloClientAddonState([], 0)).toEqual({ options: [], activeIndex: -1 });
  });

  it('numbers operation names that occur more than once', () => {
    const state = getApolloClientAddonState([mocks[0]!, mocks[1]!, mocks[0]!], 0);

    expect(state.options).toEqual(['GetViewer (1)', 'GetPosts', 'GetViewer (2)']);
  });

  it('uses operationName when the request has one (Apollo Client 3)', () => {
    const state = getApolloClientAddonState([{ request: { query: GET_VIEWER, operationName: 'Custom' } }], 0);

    expect(state.options).toEqual(['Custom']);
  });

  it('uses "Unnamed" for an anonymous operation', () => {
    const state = getApolloClientAddonState([{ request: { query: gql('{ viewer { id } }') } }], 0);

    expect(state.options).toEqual(['Unnamed']);
  });
});
