import React from 'react';
import { SyntaxHighlighter, TabsState } from '@storybook/components';

import { Tabs, QueryMetadata } from './types';

type RequestProps = Pick<QueryMetadata, 'query' | 'variables'>;
type ResponseProps = Pick<QueryMetadata, 'data'>;

type QueryProps = QueryMetadata & {
  initialTab: Tabs;
};

const Wrapper: React.FC = ({ children }) => (
  <div style={{ paddingTop: '1rem' }}>{children}</div>
);

const QueryRequest: React.FC<RequestProps> = ({ query, variables }) => (
  <div>
    <Wrapper>
      <h4>Query</h4>
      <SyntaxHighlighter language="graphql" copyable format bordered>
        {query}
      </SyntaxHighlighter>
    </Wrapper>

    <Wrapper>
      <h4>Variables</h4>
      <SyntaxHighlighter language="json" copyable format bordered>
        {JSON.stringify(variables, null, 2)}
      </SyntaxHighlighter>
    </Wrapper>
  </div>
);

const QueryResponse: React.FC<ResponseProps> = ({ data }) => (
  <Wrapper>
    <h4>Mocked Data</h4>
    <SyntaxHighlighter language="json" copyable format bordered>
      {JSON.stringify(data, null, 2)}
    </SyntaxHighlighter>
  </Wrapper>
);

export const QueryDetails: React.FC<QueryProps> = ({
  data,
  initialTab,
  name,
  query,
  variables,
}) => {
  return (
    <Wrapper>
      <h3>{name}</h3>

      <TabsState initial={initialTab}>
        <div key={Tabs.Request} id={Tabs.Request} title={Tabs.Request}>
          <QueryRequest query={query} variables={variables} />
        </div>

        <div key={Tabs.Response} id={Tabs.Response} title={Tabs.Response}>
          <QueryResponse data={data} />
        </div>
      </TabsState>
    </Wrapper>
  );
};
