import CreateTask from "@/components/custom/task/CreateTask";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof CreateTask> = {
  title: "CreateTask",
  component: CreateTask,
};

export default meta;

type Template = StoryObj<typeof CreateTask>;

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
