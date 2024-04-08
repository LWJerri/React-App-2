import EditBoard from "@/components/custom/board/EditBoard";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof EditBoard> = {
  title: "EditBoard",
  component: EditBoard,
};

export default meta;

type Template = StoryObj<typeof EditBoard>;

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
