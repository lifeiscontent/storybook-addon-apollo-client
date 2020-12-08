import React, { Fragment, useState } from 'react';
import { useParameter } from '@storybook/api';
import {
  Form,
  Placeholder,
  SyntaxHighlighter,
  TabsState,
} from '@storybook/components';
import { PARAM_KEY } from './constants';
import { MockedResponse, Parameters } from './types';
import { ASTNode, OperationDefinitionNode, print } from 'graphql';

function safePrint(ast: ASTNode) {
  try {
    return print(ast);
  } catch {
    return ast.loc?.source?.body;
  }
}

const getOperationName = (mockedResponse: MockedResponse): string => {
  if (mockedResponse.request.operationName) {
    return mockedResponse.request.operationName;
  }

  const operationDefinition = mockedResponse.request.query.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      definition.kind === 'OperationDefinition'
  );

  if (operationDefinition && operationDefinition.name) {
    return operationDefinition.name.value;
  }

  return 'Unnamed';
};

export const ApolloClientPanel: React.FC = () => {
  const { mocks = [] } = useParameter<Parameters>(PARAM_KEY, {});
  const [activeMockIndex, setActiveMockIndex] = useState<number>(() =>
    mocks.length ? 0 : -1
  );

  if (mocks.length === 0) {
    return <Placeholder>No mocks for this story</Placeholder>;
  }

  const mockedResponse = mocks[activeMockIndex];

  const query = safePrint(mockedResponse.request.query);

  return (
    <Fragment key={activeMockIndex}>
      <Form.Field label="Mocks">
        <Form.Select
          value={activeMockIndex}
          onChange={(event) =>
            setActiveMockIndex(Number(event.currentTarget.value))
          }
          size="auto"
        >
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
            {query ? (
              <SyntaxHighlighter language="graphql" copyable bordered padded>
                {query}
              </SyntaxHighlighter>
            ) : (
              <Placeholder>Could not parse query</Placeholder>
            )}
          </div>
          <div key="variables" id="variables" title="Variables">
            <SyntaxHighlighter language="json" copyable bordered padded>
              {JSON.stringify(mockedResponse.request.variables, null, 2)}
            </SyntaxHighlighter>
          </div>
          <div key="context" id="context" title="Context">
            {mockedResponse.request.context ? (
              <SyntaxHighlighter language="json" copyable bordered padded>
                {JSON.stringify(mockedResponse.request.context, null, 2)}
              </SyntaxHighlighter>
            ) : (
              <Placeholder>No context in request</Placeholder>
            )}
          </div>
          <div key="result" id="result" title="Result">
            {mockedResponse.result ? (
              <SyntaxHighlighter language="json" copyable bordered padded>
                {JSON.stringify(mockedResponse.result, null, 2)}
              </SyntaxHighlighter>
            ) : (
              <Placeholder>No result in mockedResponse</Placeholder>
            )}
          </div>
          <div key="error" id="error" title="Error">
            {mockedResponse.error ? (
              <SyntaxHighlighter language="json" copyable bordered padded>
                {JSON.stringify(
                  mockedResponse.error,
                  Object.getOwnPropertyNames(mockedResponse.error),
                  2
                )}
              </SyntaxHighlighter>
            ) : (
              <Placeholder>No error in mockedResponse</Placeholder>
            )}
          </div>
        </TabsState>
      )}
    </Fragment>
  );
};
