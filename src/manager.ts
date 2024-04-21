import { addons, types } from "@storybook/manager-api";
import { ADDON_ID, PANEL_ID } from "./constants";
import { Panel } from "./Panel";
import { Title } from "./Title";
import { ApolloParameters } from "./types";

declare module "@storybook/react" {
  interface Parameters extends ApolloParameters {}
}

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: Title,
    match: ({ viewMode }) => viewMode === "story",
    render: Panel,
  });
});
