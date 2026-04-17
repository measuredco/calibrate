import { type ClbrExpanderProps, renderClbrExpander } from "./expander";

const meta = {
  argTypes: {
    controlsId: { control: { type: "text" } },
    expanded: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  title: "Control/Expander",
};

export default meta;

export const Default = {
  args: {
    controlsId: "",
    expanded: false,
    label: "Menu",
    size: "md",
  } satisfies ClbrExpanderProps,
  render: (args: ClbrExpanderProps) => renderClbrExpander(args),
};
