import type { Preview } from "@storybook/react";
import { withApolloClient } from "./withApolloClient";

const preview: Preview = {
  decorators: [withApolloClient],
};

export default preview;
