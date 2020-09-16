import { DocumentNode } from 'graphql';
import { gql } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';

import {
  ERROR_MOCK_DATA,
  formatMockedQuery,
  getMockedRequestData,
  isMockGraphqlError,
  parseRequestMetadata,
} from './utils';

const variables = {
  username: 'mock_username',
};

const userWithoutTypeName = {
  id: 'user_id',
};

const user = {
  __typename: 'User',
  ...userWithoutTypeName,
};

const QUERY_STRING = `query GetUser($username: String!) {
  user(username: $username) {
    id
  }
}`;
const query: DocumentNode = gql`
  ${QUERY_STRING}
`;

describe('Addon Panel Utils', () => {
  describe('Parse request metadata', () => {
    it('Should return the name, query string, and variables for a request', () => {
      const request = {
        query,
        variables,
      };
      const parsed = parseRequestMetadata(request);
      expect(parsed).toEqual({
        name: 'GetUser',
        query: QUERY_STRING,
        variables: { username: 'mock_username' },
      });
    });
    it('Should return a sensible default if variables are not required', () => {
      const request = {
        query,
      };
      const parsed = parseRequestMetadata(request);
      expect(parsed).toEqual({
        name: 'GetUser',
        query: QUERY_STRING,
        variables: {},
      });
    });
  });

  describe('Get mocked request data', () => {
    it('Should parse static mock data', () => {
      const result = { data: { user } };
      const data = getMockedRequestData(result);
      expect(data).toEqual({ user });
    });
    it('Should parse mock data resolver functions', () => {
      const result = () => ({ data: { user } });
      const data = getMockedRequestData(result);
      expect(data).toEqual({ user });
    });
  });

  describe('Is mock GraphQL error', () => {
    it('Should identify partial responses with mocked errors', () => {
      const result = {
        data: { user },
        error: new Error('Graphql failed'),
      };
      const isError = isMockGraphqlError(result);
      expect(isError).toBeTruthy();
    });

    it('Should ignore results without a mocked error', () => {
      const result = {
        data: { user },
      };
      const isError = isMockGraphqlError(result);
      expect(isError).toBeFalsy();
    });
  });

  describe('Format mocked query', () => {
    it('Should format a successful request for display', () => {
      const mocks: ReadonlyArray<MockedResponse> = [
        {
          request: {
            query,
            variables,
          },
          result: { data: { user } },
        },
      ];
      const formatted = formatMockedQuery(mocks[0]);
      expect(formatted).toEqual({
        name: 'GetUser',
        query: QUERY_STRING,
        data: { user },
        variables: { username: 'mock_username' },
      });
    });

    it('Should format an error request for display', () => {
      const mock = {
        request: {
          query,
          variables,
        },
        error: new Error('Something went wrong'),
      };
      const formatted = formatMockedQuery(mock);
      expect(formatted).toEqual({
        name: 'GetUser',
        query: QUERY_STRING,
        data: ERROR_MOCK_DATA,
        variables: { username: 'mock_username' },
      });
    });

    it('Should format a GraphQL error request for display', () => {
      const mock = {
        request: {
          query,
          variables,
        },
        result: {
          data: { user },
          error: new Error('Something went wrong'),
        },
      };
      const formatted = formatMockedQuery(mock);
      expect(formatted).toEqual({
        name: 'GetUser',
        query: QUERY_STRING,
        data: { ...ERROR_MOCK_DATA, user },
        variables: { username: 'mock_username' },
      });
    });
  });
});
