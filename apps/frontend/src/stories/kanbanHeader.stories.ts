import KanbanHeader from "@/components/custom/kanban/KanbanHeader";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanHeader> = {
  title: "KanbanHeader",
  component: KanbanHeader,
};

export default meta;

type Template = StoryObj<typeof KanbanHeader>;

export const Default: Template = {};
