import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ApolloClientPanel } from './panel';
import { ADDON_ID, EVENTS, PANEL_ID, PARAM_KEY } from './constants';
import { getTitle } from './title';
import { setStore } from './store';

addons.register(ADDON_ID, (api) => {
  const channel = api.getChannel();
  channel.addListener(EVENTS.RESULT, setStore);
  addons.add(PANEL_ID, {
    paramKey: PARAM_KEY,
    title: getTitle,
    type: types.PANEL,
    match: ({ viewMode }) => viewMode === 'story',
    render({ active = false, key }) {
      return (
        <AddonPanel key={key} active={active}>
          {!active || !api.getCurrentStoryData() ? null : <ApolloClientPanel />}
        </AddonPanel>
      );
    },
  });
});
