import React from "react";

import type { MockedResponse } from "@apollo/client/testing";
import {
  Placeholder,
  SyntaxHighlighter,
  TabsState,
} from "storybook/internal/components";
import { convert, themes } from "storybook/internal/theming";

interface PanelContentProps {
  mock?: MockedResponse;
  query?: string;
}

function TabContent({
  children,
  fallback,
  language,
}: {
  children: any;
  fallback: string;
  language: "json" | "graphql";
}) {
  return children ? (
    <SyntaxHighlighter bordered copyable language={language} padded>
      {language === "json" ? JSON.stringify(children, null, 2) : children}
    </SyntaxHighlighter>
  ) : (
    <Placeholder>{fallback}</Placeholder>
  );
}

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/code/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent: React.FC<PanelContentProps> = ({ mock, query }) => {
  if (!mock) {
    return <Placeholder>No mock selected</Placeholder>;
  }

  return (
    <TabsState
      initial="query"
      key={query}
      backgroundColor={convert(themes.normal).background.hoverable}
    >
      <div
        color={convert(themes.normal).color.primary}
        id="query"
        title="Query"
      >
        <TabContent fallback="Could not parse query" language="graphql">
          {query}
        </TabContent>
      </div>
      <div
        color={convert(themes.normal).color.warning}
        id="variables"
        title="Variables"
      >
        <TabContent fallback="No variables in request" language="json">
          {mock.request.variables}
        </TabContent>
      </div>
      <div
        color={convert(themes.normal).color.ancillary}
        id="extensions"
        title="Extensions"
      >
        <TabContent fallback="No extensions in request" language="json">
          {mock.request.extensions}
        </TabContent>
      </div>
      <div
        color={convert(themes.normal).color.medium}
        id="context"
        title="Context"
      >
        <TabContent fallback="No context in request" language="json">
          {mock.request.context}
        </TabContent>
      </div>
      <div
        color={convert(themes.normal).color.positive}
        id="result"
        title="Result"
      >
        <TabContent fallback="No result in mock" language="json">
          {mock.result}
        </TabContent>
      </div>
      <div
        color={convert(themes.normal).color.negative}
        id="error"
        title="Error"
      >
        <TabContent fallback="No error in mock" language="json">
          {mock.error}
        </TabContent>
      </div>
    </TabsState>
  );
};
