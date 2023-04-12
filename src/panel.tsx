import { Fragment } from 'react';
import { useAddonState, useChannel } from '@storybook/manager-api';
import {
  Form,
  Placeholder,
  SyntaxHighlighter,
  TabsState,
} from '@storybook/components';
import { OperationDefinitionNode } from 'graphql';
import { ADDON_ID, EVENTS } from './constants';
import { MockedResponse } from './types';

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

type State = {
  queries: string[];
  mocks: MockedResponse[];
  activeIndex: number;
};

export const ApolloClientPanel: React.FC = () => {
  const [{ mocks, activeIndex, queries }, _setState] = useAddonState<State>(
    ADDON_ID,
    { mocks: [], activeIndex: -1, queries: [] }
  );

  useChannel({
    [EVENTS.RESULT]: _setState,
  });

  if (mocks.length === 0) {
    return <Placeholder>No mocks for this story</Placeholder>;
  }

  const mockedResponse = mocks[activeIndex];
  const query = queries[activeIndex];

  return (
    <Fragment key={query}>
      <Form.Field label="Mocks">
        <Form.Select
          value={activeIndex}
          disabled={activeIndex === -1}
          onChange={(event) =>
            _setState((prev) => ({
              ...prev,
              activeIndex: Number(event.currentTarget.value),
            }))
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
