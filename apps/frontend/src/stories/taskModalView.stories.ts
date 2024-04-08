import TaskModalView from "@/components/custom/task/TaskModalView";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TaskModalView> = {
  title: "TaskModalView",
  component: TaskModalView,
};

export default meta;

type Template = StoryObj<typeof TaskModalView>;

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
