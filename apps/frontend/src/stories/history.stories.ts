import History from "@/components/custom/History";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof History> = {
  title: "History",
  component: History,
};

export default meta;

type Template = StoryObj<typeof History>;

export const Open: Template = {
  args: {
    open: true,
    close: fn(),
  },
};

export const Close: Template = {
  args: {
    open: false,
    close: fn(),
  },
};
