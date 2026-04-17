import { defineClbrRange, type ClbrRangeProps, renderClbrRange } from "./range";

defineClbrRange();

const meta = {
  argTypes: {
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  title: "Control/Range",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    disabled: false,
    id: "rangeId",
    inlineSize: "fit",
    label: "Label",
    max: 100,
    min: 0,
    name: "",
    size: "md",
    step: 1,
    value: 50,
  } satisfies ClbrRangeProps,
  render: (args: ClbrRangeProps) =>
    renderClbrRange({
      ...args,
      id: args.id?.trim() || "storybook-fallback-range-id",
    }),
};
