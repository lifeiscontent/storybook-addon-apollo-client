import React, { useState } from 'react';

import { Placeholder, SyntaxHighlighter, TabsView } from 'storybook/internal/components';
import { useTheme } from 'storybook/theming';

import type { ApolloClientAddonState } from '../types';

type PanelContentProps = Omit<ApolloClientAddonState, 'options' | 'activeIndex'>;

interface TabDefinition {
  id: string;
  title: string;
  value?: string;
  fallback: string;
  language: 'json' | 'graphql';
}

function TabContent({ value, fallback, language }: Pick<TabDefinition, 'value' | 'fallback' | 'language'>) {
  return value ? (
    <SyntaxHighlighter bordered copyable language={language} padded>
      {value}
    </SyntaxHighlighter>
  ) : (
    <Placeholder>{fallback}</Placeholder>
  );
}

export const PanelContent: React.FC<PanelContentProps> = ({ query, variables, extensions, context, result, error }) => {
  // The selected tab stays the same when you select a different mock.
  const [selected, setSelected] = useState('variables');
  const theme = useTheme();

  const definitions: TabDefinition[] = [
    { id: 'variables', title: 'Variables', value: variables, fallback: 'No variables in request', language: 'json' },
    { id: 'result', title: 'Result', value: result, fallback: 'No result in mock', language: 'json' },
    { id: 'error', title: 'Error', value: error, fallback: 'No error in mock', language: 'json' },
    { id: 'query', title: 'Query', value: query, fallback: 'No query in request', language: 'graphql' },
    {
      id: 'extensions',
      title: 'Extensions',
      value: extensions,
      fallback: 'No extensions in request',
      language: 'json',
    },
    { id: 'context', title: 'Context', value: context, fallback: 'No context in request', language: 'json' },
  ];

  const tabs = definitions.map(({ id, title, value, fallback, language }) => ({
    id,
    title,
    children: <TabContent value={value} fallback={fallback} language={language} />,
  }));

  return (
    <TabsView selected={selected} onSelectionChange={setSelected} backgroundColor={theme.background.app} tabs={tabs} />
  );
};
