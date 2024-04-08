import TaskSkeleton from "@/components/custom/task/TaskSkeleton";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TaskSkeleton> = {
  title: "TaskSkeleton",
  component: TaskSkeleton,
};

export default meta;

type Template = StoryObj<typeof TaskSkeleton>;

export const Default: Template = {};
