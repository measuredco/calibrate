import { type ClbrFieldsetProps, renderClbrFieldset } from "./fieldset";

const meta = {
  argTypes: {
    children: { control: false },
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
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
    inlineSize: "fit",
    invalid: false,
    legend: "Legend",
  } satisfies ClbrFieldsetProps,
  render: (args: ClbrFieldsetProps) =>
    renderClbrFieldset({
      ...args,
      id: args.id?.trim() || "storybook-fallback-fieldset-id",
    }),
};
