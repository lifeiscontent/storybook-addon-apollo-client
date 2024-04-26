import type { Preview } from "@storybook/react";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();

const preview: Preview = {};

export default preview;
