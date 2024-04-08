import BoardList from "@/components/custom/board/BoardList";
import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof BoardList> = {
  title: "BoardList",
  component: BoardList,
};

export default meta;

type Template = StoryObj<typeof BoardList>;

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
