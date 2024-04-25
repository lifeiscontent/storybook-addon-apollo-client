import type { Meta, StoryObj } from "@storybook/react";

import { Display } from "./Display";

const meta: Meta<typeof Display> = {
  title: "Example/Display",
  component: Display,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Display>;

export const Default: Story = {};
