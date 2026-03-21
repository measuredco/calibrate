import { type ClbrRadiosProps, renderClbrRadios } from "./radios";

const meta = {
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["vertical", "horizontal"],
    },
  },
  title: "Components/Radios",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    disabled: false,
    id: "radiosId",
    invalid: false,
    radios: [
      { label: "Radio one", value: "radio-one" },
      {
        description: "Description",
        label: "Radio two",
        value: "radio-two",
      },
      { label: "Radio three", value: "radio-three" },
      { disabled: true, label: "Radio four", value: "radio-four" },
    ],
    legend: "Legend",
    name: "radio-group",
    orientation: "vertical",
    required: false,
    value: "radio-one",
  } satisfies ClbrRadiosProps,
  render: (args: ClbrRadiosProps) =>
    renderClbrRadios({
      ...args,
      id: args.id?.trim() || "storybook-fallback-radios-id",
      name: args.name?.trim() || "storybook-fallback-radios-name",
    }),
};
