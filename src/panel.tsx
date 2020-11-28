import React, { Fragment, useState } from 'react';
import { useParameter } from '@storybook/api';
import { Form, Placeholder, TabsState } from '@storybook/components';
import { Kind, OperationDefinitionNode, print } from 'graphql';
import { PARAM_KEY } from './constants';
import { Parameters, MockedResponse } from './types';
import { SafeHighligher } from './safe-highligher';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isOperationDefinitionNode = (
  value: unknown
): value is OperationDefinitionNode =>
  isObject(value) && value.kind === Kind.OPERATION_DEFINITION;

const getOperationName = (mockedResponse: MockedResponse): string => {
  if (mockedResponse.request.operationName) {
    return mockedResponse.request.operationName;
  }

  const operationDefinition = mockedResponse.request.query.definitions.find(
    isOperationDefinitionNode
  );

  if (operationDefinition && operationDefinition.name) {
    return print(operationDefinition.name);
  }

  return 'Unnamed';
};

export const ApolloClientPanel: React.FC = () => {
  const [mockedResponse, setMockedResponse] = useState<MockedResponse | null>(
    null
  );
  const { mocks = [] } = useParameter<Parameters>(PARAM_KEY) || {};

  if (mocks.length === 0) {
    return <Placeholder>No mocks for this story</Placeholder>;
  }

  return (
    <Fragment>
      <Form.Field label="Mocks">
        <Form.Select
          defaultValue="-1"
          onChange={(event) => {
            setMockedResponse(
              event.currentTarget.value !== '-1'
                ? mocks[Number(event.currentTarget.value)]
                : null
            );
          }}
          size="auto"
        >
          <option value="-1">Select Mock</option>
          {mocks.map((mock, index) => (
            <option key={index} value={index}>
              {index + 1}. {getOperationName(mock)}
            </option>
          ))}
        </Form.Select>
      </Form.Field>
      {mockedResponse && (
        <TabsState initial="request">
          <div key="request" id="request" title="Request">
            <SafeHighligher
              kind="query"
              language="graphql"
              type="request"
              value={mockedResponse.request.query}
            />
          </div>
          <div key="variables" id="variables" title="Variables">
            <SafeHighligher
              kind="variables"
              language="json"
              type="request"
              value={mockedResponse.request.variables}
            />
          </div>
          <div key="context" id="context" title="Context">
            <SafeHighligher
              kind="context"
              language="json"
              type="request"
              value={mockedResponse.request.context}
            />
          </div>
          <div key="result" id="result" title="Result">
            <SafeHighligher
              kind="data"
              language="json"
              type="result"
              value={mockedResponse.result}
            />
          </div>
          <div key="error" id="error" title="Error">
            <SafeHighligher
              kind="error"
              language="json"
              type="result"
              value={mockedResponse.error}
            />
          </div>
        </TabsState>
      )}
    </Fragment>
  );
};
