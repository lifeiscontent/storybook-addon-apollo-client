import React from 'react';
import { addons, types } from '@storybook/addons';

import { ApolloClientPanel } from './addonPanel';
import config from './config';

const { parameterName, title } = config;
const PANEL_ID = `${parameterName}/panel`;

addons.register(parameterName, () => {
  addons.add(PANEL_ID, {
    title,
    type: types.PANEL,
    render: ({ active = false, key }) => (
      <ApolloClientPanel active={active} key={key} />
    ),
  });
});
