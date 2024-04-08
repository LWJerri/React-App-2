import TaskHistory from "@/components/custom/task/TaskHistory";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof TaskHistory> = {
  title: "TaskHistory",
  component: TaskHistory,
};

export default meta;

type Template = StoryObj<typeof TaskHistory>;

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
