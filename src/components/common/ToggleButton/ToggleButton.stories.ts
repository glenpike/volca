import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { expect, fn } from 'storybook/test';

import { ToggleButton } from './ToggleButton';

const meta = {
  title: 'Example/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'volca fm',
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('switch', { name: /volca fm/i });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  }
};

export const Secondary: Story = {
  args: {
    primary: false,
    label: 'Secondary ToggleButton',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Large ToggleButton',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Small ToggleButton',
  },
};

export const LightBackground: Story = {
  args: {
    primary: true,
    label: "Light Background ToggleButton",
    lightBackground: true,
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled ToggleButton",
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('switch', { name: /Disabled ToggleButton/i });
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  }
};

