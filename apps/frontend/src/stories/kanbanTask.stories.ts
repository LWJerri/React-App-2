import KanbanTask from "@/components/custom/kanban/KanbanTask";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanTask> = {
  title: "KanbanTask",
  component: KanbanTask,
};

export default meta;

type Template = StoryObj<typeof KanbanTask>;

export const Default: Template = {};
