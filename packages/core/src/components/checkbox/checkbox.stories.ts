import { type ClbrCheckboxProps, renderClbrCheckbox } from "./checkbox";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  title: "Components/Checkbox",
};

export default meta;

export const Default = {
  args: {
    checked: false,
    description: "",
    descriptionId: "",
    disabled: false,
    label: "Checkbox",
    name: "",
    required: false,
    size: "md",
    value: "",
  } satisfies ClbrCheckboxProps,
  render: (args: ClbrCheckboxProps) => {
    return renderClbrCheckbox({
      ...args,
      descriptionId: args.description?.trim()
        ? args.descriptionId?.trim() || "storybook-fallback-description-id"
        : undefined,
    });
  },
};

export const Indeterminate = {
  args: {
    ...Default.args,
    label: "Partially selected",
  } satisfies ClbrCheckboxProps,
  parameters: {
    docs: { disable: true },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const input = canvasElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement | null;

    if (input) input.indeterminate = true;
  },
  render: Default.render,
};
