import { type ClbrPanelProps, renderClbrPanel } from "./panel";

const meta = {
  argTypes: {
    children: { control: false },
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
    },
    padding: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand"],
    },
  },
  title: "Structure/Panel",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    inlineSize: "fit",
    offsetStroke: false,
    padding: "md",
    surface: undefined,
  } satisfies ClbrPanelProps,
  render: (args: ClbrPanelProps) => renderClbrPanel(args),
};
