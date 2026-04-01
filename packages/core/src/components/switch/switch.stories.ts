import { type ClbrSwitchProps, renderClbrSwitch } from "./switch";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  title: "Control/Switch",
};

export default meta;

export const Default = {
  args: {
    checked: false,
    description: "Description",
    descriptionId: "descriptionId",
    disabled: false,
    label: "Label",
    name: "",
    size: "md",
    value: "",
  } satisfies ClbrSwitchProps,
  render: (args: ClbrSwitchProps) => {
    return renderClbrSwitch({
      ...args,
      descriptionId: args.description?.trim()
        ? args.descriptionId?.trim() || "storybook-fallback-description-id"
        : undefined,
    });
  },
};
