import KanbanTaskButton from "@/components/custom/kanban/KanbanTaskButton";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanTaskButton> = {
  title: "KanbanTaskButton",
  component: KanbanTaskButton,
};

export default meta;

type Template = StoryObj<typeof KanbanTaskButton>;

export const Default: Template = {};
