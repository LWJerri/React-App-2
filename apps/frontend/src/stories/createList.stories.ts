import CreateList from "@/components/custom/list/CreateList";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof CreateList> = {
  title: "CreateList",
  component: CreateList,
};

export default meta;

type Template = StoryObj<typeof CreateList>;

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
