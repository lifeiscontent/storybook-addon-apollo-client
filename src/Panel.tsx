import React from 'react';

import { AddonPanel, Form, Placeholder } from 'storybook/internal/components';
import type { Addon_RenderOptions } from 'storybook/internal/types';

import { useAddonState, useChannel } from 'storybook/manager-api';
import { PanelContent } from './components/PanelContent';
import { ADDON_ID, EVENTS } from './constants';
import type { ApolloClientAddonState } from './types';

export const Panel: React.FC<Partial<Addon_RenderOptions>> = ({ active = false }) => {
  const [state, setState] = useAddonState<ApolloClientAddonState>(ADDON_ID, {
    options: [],
    activeIndex: -1,
  });

  const channel = useChannel({
    [EVENTS.RESULT]: (state) => setState(state),
  });

  return (
    <AddonPanel active={active}>
      {state.options.length ? (
        <>
          <Form.Field label="Mock">
            <Form.Select
              size="flex"
              value={state.activeIndex === -1 ? '' : state.activeIndex}
              onChange={(event) => {
                const { value } = event.currentTarget;
                channel(EVENTS.REQUEST, value === '' ? -1 : Number(value));
              }}
            >
              <option value="">Select a mock</option>
              {state.options.map((label, index) => (
                <option key={index} value={index}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Field>
          <PanelContent
            context={state.context}
            query={state.query}
            variables={state.variables}
            extensions={state.extensions}
            result={state.result}
            error={state.error}
            mockOptions={state.mockOptions}
          />
        </>
      ) : (
        <Placeholder>This story has no Apollo Client mocks. Add them in the apolloClient parameter.</Placeholder>
      )}
    </AddonPanel>
  );
};
