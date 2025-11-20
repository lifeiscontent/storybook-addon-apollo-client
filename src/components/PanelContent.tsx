import React from 'react';

import { Placeholder, SyntaxHighlighter, TabsState } from 'storybook/internal/components';
import { convert, themes } from 'storybook/theming';

interface PanelContentProps {
  variables?: string;
  query?: string;
  extensions?: string;
  context?: string;
  result?: string;
  error?: string;
}

function TabContent({
  children,
  fallback,
  language,
}: {
  children?: string;
  fallback: string;
  language: 'json' | 'graphql';
}) {
  return children ? (
    <SyntaxHighlighter bordered copyable language={language} padded>
      {children}
    </SyntaxHighlighter>
  ) : (
    <Placeholder>{fallback}</Placeholder>
  );
}

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/code/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent: React.FC<PanelContentProps> = ({ query, variables, extensions, context, result, error }) => {
  return (
    <TabsState initial="variables" key={query} backgroundColor={convert(themes.normal).background.hoverable}>
      <div color={convert(themes.normal).color.warning} id="variables" title="Variables">
        <TabContent fallback="No variables in request" language="json">
          {variables}
        </TabContent>
      </div>
      <div color={convert(themes.normal).color.positive} id="result" title="Result">
        <TabContent fallback="No result in mock" language="json">
          {result}
        </TabContent>
      </div>
      <div color={convert(themes.normal).color.negative} id="error" title="Error">
        <TabContent fallback="No error in mock" language="json">
          {error}
        </TabContent>
      </div>
      <div color={convert(themes.normal).color.primary} id="query" title="Query">
        <TabContent fallback="No query in request" language="graphql">
          {query}
        </TabContent>
      </div>
      <div color={convert(themes.normal).color.ancillary} id="extensions" title="Extensions">
        <TabContent fallback="No extensions in request" language="json">
          {extensions}
        </TabContent>
      </div>
      <div color={convert(themes.normal).color.medium} id="context" title="Context">
        <TabContent fallback="No context in request" language="json">
          {context}
        </TabContent>
      </div>
    </TabsState>
  );
};
