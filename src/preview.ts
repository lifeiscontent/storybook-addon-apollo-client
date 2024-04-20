import type { Renderer, ProjectAnnotations } from "@storybook/types";
import { withApolloClient } from "./withApolloClient";
import { PARAM_KEY } from "./constants";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withApolloClient],
  parameters: {
    [PARAM_KEY]: {},
  },
};

export default preview;
