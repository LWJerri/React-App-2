import Navbar from "@/components/custom/navigation/Navbar";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Navbar> = {
  title: "Navbar",
  component: Navbar,
};

export default meta;

type Template = StoryObj<typeof Navbar>;

export const Default: Template = {};
