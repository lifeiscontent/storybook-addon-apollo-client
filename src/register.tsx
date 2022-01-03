import { addons, RenderOptions, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ApolloClientPanel } from './panel';
import { ADDON_ID, PARAM_KEY } from './constants';
import { getTitle } from './title';

addons.register(ADDON_ID, (api) => {
  addons.add(ADDON_ID, {
    paramKey: PARAM_KEY,
    render({ active = false, key }: RenderOptions) {
      return (
        <AddonPanel key={key} active={active}>
          {!active || !api.getCurrentStoryData() ? null : <ApolloClientPanel />}
        </AddonPanel>
      );
    },
    title: getTitle,
    type: types.PANEL,
  });
});
