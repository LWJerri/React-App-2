import CreateBoard from "@/components/custom/board/CreateBoard";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof CreateBoard> = {
  title: "CreateBoard",
  component: CreateBoard,
};

export default meta;

type Template = StoryObj<typeof CreateBoard>;

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
