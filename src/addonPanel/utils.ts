import { ExecutableDefinitionNode } from 'graphql';
import { MockedResponse } from '@apollo/client/testing';

import { QueryMetadata } from './types';

type MockedRequest = MockedResponse['request'];
type MockedResult = MockedResponse['result'];

// Error metadata is not reliably passed through from MockedProvider to addons
// Display some placeholder messaging rather than trying to parse error name from mocks
export const ERROR_MOCK_DATA = {
  error: 'Error {}',
};

// Simulate an error in the parse, validate, or execute phases of a Graphql operation
// https://www.apollographql.com/docs/react/development-testing/testing/#testing-error-states
export const isMockGraphqlError = (result: MockedResult) =>
  Boolean((result as any)?.error);

export const parseRequestMetadata = (request: MockedRequest) => {
  const requestDefinition = request.query
    .definitions[0] as ExecutableDefinitionNode;

  const name = requestDefinition?.name?.value ?? '';
  const query = request?.query?.loc?.source.body ?? '';
  const variables = request?.variables ?? {};

  return { name, query: query.trim(), variables };
};

export const getMockedRequestData = (result: MockedResult) => {
  if (typeof result === 'function') {
    const resultData = result().data;
    return resultData || {};
  }
  return result?.data ?? {};
};

const createErrorMock = ({
  name,
  query,
  variables,
}: Pick<QueryMetadata, 'name' | 'query' | 'variables'>): QueryMetadata => ({
  name,
  query,
  variables,
  data: ERROR_MOCK_DATA,
});

const createInternalErrorMock = ({
  data,
  ...queryMetadata
}: QueryMetadata): QueryMetadata => ({
  ...queryMetadata,
  data: {
    ...ERROR_MOCK_DATA,
    ...data,
  },
});

export const formatMockedQuery = (mockQuery: MockedResponse): QueryMetadata => {
  const { request, result, error } = mockQuery;
  const { name, query, variables } = parseRequestMetadata(request);
  const data = getMockedRequestData(result);

  // Handle network error with no response
  if (error) {
    return createErrorMock({ name, query, variables });
  }

  // Handle internal Graphql error with partial response
  if (isMockGraphqlError(result)) {
    return createInternalErrorMock({ data, name, query, variables });
  }

  // Handle successful mocked response
  return {
    data,
    name,
    query,
    variables,
  };
};
