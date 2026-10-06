import { expect } from 'storybook/test';
import preview from '../../.storybook/preview';

import { Display } from './Display';

const meta = preview.meta({
  title: 'Example/Display',
  component: Display,
  tags: ['autodocs'],
});

/** A story without the apolloClient parameter renders without MockedProvider. */
export const Default = meta.story({
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Display' })).toBeInTheDocument();
  },
});
