import type { Renderer, ProjectAnnotations } from "@storybook/types";
import { withApolloClient } from "./withApolloClient";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withApolloClient],
};

export default preview;
