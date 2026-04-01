import { type ClbrFieldsetProps, renderClbrFieldset } from "./fieldset";

const meta = {
  argTypes: {
    children: { control: false },
    width: {
      control: { type: "select" },
      options: ["full", "auto"],
    },
  },
  title: "Control/Fieldset",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    description: "Description",
    disabled: false,
    id: "fieldsetId",
    invalid: false,
    legend: "Legend",
    width: "auto",
  } satisfies ClbrFieldsetProps,
  render: (args: ClbrFieldsetProps) =>
    renderClbrFieldset({
      ...args,
      id: args.id?.trim() || "storybook-fallback-fieldset-id",
    }),
};
