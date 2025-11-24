import React from 'react';

import { AddonPanel, Form } from 'storybook/internal/components';
import type { Addon_RenderOptions } from 'storybook/internal/types';

import { useAddonState, useChannel } from 'storybook/manager-api';
import { PanelContent } from './components/PanelContent';
import { ADDON_ID, EVENTS } from './constants';
import type { ApolloClientAddonState } from './types';

export const Panel: React.FC<Partial<Addon_RenderOptions>> = ({ active = false }) => {
  const [state, setState] = useAddonState<ApolloClientAddonState>(ADDON_ID, {
    options: [],
    variables: undefined,
    query: undefined,
    extensions: undefined,
    context: undefined,
    result: undefined,
    error: undefined,
    activeIndex: -1,
  });

  const channel = useChannel({
    [EVENTS.RESULT]: (state) => setState(state),
  });

  return (
    <AddonPanel active={active}>
      <>
        <Form.Field label="Mock">
          <Form.Select
            size="flex"
            value={state.activeIndex}
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
        />
      </>
    </AddonPanel>
  );
};
