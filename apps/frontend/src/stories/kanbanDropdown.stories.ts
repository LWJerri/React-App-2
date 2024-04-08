import KanbanDropdown from "@/components/custom/kanban/KanbanDropdown";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanDropdown> = {
  title: "KanbanDropdown",
  component: KanbanDropdown,
};

export default meta;

type Template = StoryObj<typeof KanbanDropdown>;

export const Default: Template = {};
