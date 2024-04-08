import EditList from "@/components/custom/list/EditList";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof EditList> = {
  title: "EditList",
  component: EditList,
};

export default meta;

type Template = StoryObj<typeof EditList>;

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
