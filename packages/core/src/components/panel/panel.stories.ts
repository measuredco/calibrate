import { type ClbrPanelProps, renderClbrPanel } from "./panel";

const meta = {
  argTypes: {
    children: { control: false },
    padding: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand", "inverse", "brand-inverse"],
    },
  },
  title: "Structure/Panel",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    padding: "md",
    surface: undefined,
  } satisfies ClbrPanelProps,
  render: (args: ClbrPanelProps) => renderClbrPanel(args),
};
