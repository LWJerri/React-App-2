import EditTask from "@/components/custom/task/EditTask";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof EditTask> = {
  title: "EditTask",
  component: EditTask,
};

export default meta;

type Template = StoryObj<typeof EditTask>;

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
