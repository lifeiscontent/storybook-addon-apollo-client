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
  /** Show the tab only when it has a value. */
  optional?: boolean;
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

export const PanelContent: React.FC<PanelContentProps> = ({
  query,
  variables,
  extensions,
  context,
  result,
  error,
  mockOptions,
}) => {
  // The selected tab stays the same when you select a different mock.
  const [selected, setSelected] = useState('variables');
  const theme = useTheme();

  const definitions: TabDefinition[] = [
    { id: 'variables', title: 'Variables', value: variables, fallback: 'No variables in request', language: 'json' },
    { id: 'result', title: 'Result', value: result, fallback: 'No result in mock', language: 'json' },
    { id: 'error', title: 'Error', value: error, fallback: 'No error in mock', language: 'json' },
    { id: 'query', title: 'Query', value: query, fallback: 'No query in request', language: 'graphql' },
    {
      id: 'options',
      title: 'Options',
      value: mockOptions,
      fallback: 'No delay or maxUsageCount in mock',
      language: 'json',
    },
    // Only Apollo Client 3 mocks can have extensions and context.
    {
      id: 'extensions',
      title: 'Extensions',
      value: extensions,
      fallback: 'No extensions in request',
      language: 'json',
      optional: true,
    },
    {
      id: 'context',
      title: 'Context',
      value: context,
      fallback: 'No context in request',
      language: 'json',
      optional: true,
    },
  ];

  const tabs = definitions
    .filter((tab) => !tab.optional || tab.value)
    .map(({ id, title, value, fallback, language }) => ({
      id,
      title,
      children: <TabContent value={value} fallback={fallback} language={language} />,
    }));

  // If the selected tab is not shown for this mock, show the first tab.
  const current = tabs.some((tab) => tab.id === selected) ? selected : 'variables';

  return (
    <TabsView selected={current} onSelectionChange={setSelected} backgroundColor={theme.background.app} tabs={tabs} />
  );
};
