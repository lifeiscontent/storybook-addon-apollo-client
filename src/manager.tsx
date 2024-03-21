import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { ApolloClientPanel } from './panel';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';
import { Title } from './title';

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    paramKey: PARAM_KEY,
    title: <Title />,
    type: types.PANEL,
    match: ({ viewMode }) => viewMode === 'story',
    render({ active = false }) {
      if (!active || !api.getCurrentStoryData()) return null;

      return (
        <AddonPanel active={active}>
          <ApolloClientPanel />
        </AddonPanel>
      );
    },
  });
});
