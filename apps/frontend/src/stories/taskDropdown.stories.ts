import TaskDropdown from "@/components/custom/task/TaskDropdown";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TaskDropdown> = {
  title: "TaskDropdown",
  component: TaskDropdown,
};

export default meta;

type Template = StoryObj<typeof TaskDropdown>;

export const Default: Template = {};
