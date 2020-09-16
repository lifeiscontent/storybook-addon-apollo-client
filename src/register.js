import React from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import { ApolloClientPanel } from './addonPanel';
import config from './config';

const { parameterName, title } = config;
const PANEL_ID = `${parameterName}/panel`;

addons.register(parameterName, api => {
  addons.add(PANEL_ID, {
    title,
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <ApolloClientPanel />
      </AddonPanel>
    ),
  });
});
