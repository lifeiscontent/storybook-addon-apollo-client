import type { ProjectAnnotations, Renderer } from 'storybook/internal/types';
import { withApolloClientPanel } from './withApolloClientPanel';

/**
 * Storybook loads these annotations when the addon is in `main.ts` and the
 * project does not use `definePreview`. With `definePreview`, the
 * `apolloClient()` addon adds the same decorator.
 */
const preview: ProjectAnnotations<Renderer> = {
  decorators: [withApolloClientPanel],
};

export default preview;
