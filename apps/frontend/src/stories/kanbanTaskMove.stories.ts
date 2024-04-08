import KanbanTaskMove from "@/components/custom/kanban/KanbanTaskMove";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanTaskMove> = {
  title: "KanbanTaskMove",
  component: KanbanTaskMove,
};

export default meta;

type Template = StoryObj<typeof KanbanTaskMove>;

export const Default: Template = {};
