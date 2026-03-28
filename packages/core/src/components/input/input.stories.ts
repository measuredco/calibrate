import { type ClbrInputProps, renderClbrInput } from "./input";

const meta = {
  argTypes: {
    autocomplete: {
      control: { type: "text" },
      description: 'Set to `"off"` to disable (or pass `false` in code).',
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "tel", "url", "search", "numeric"],
    },
    width: {
      control: { type: "select" },
      options: ["full", "auto"],
    },
  },
  title: "Control/Input",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "inputId",
    invalid: false,
    label: "Label",
    name: "",
    pattern: "",
    readOnly: false,
    required: false,
    size: "md",
    spellcheck: false,
    type: "text",
    value: "Value",
    width: "auto",
  } satisfies ClbrInputProps,
  render: (args: ClbrInputProps) =>
    renderClbrInput({
      ...args,
      id: args.id?.trim() || "storybook-fallback-input-id",
    }),
};
