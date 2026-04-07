import { type ClbrTextareaProps, renderClbrTextarea } from "./textarea";

const meta = {
  argTypes: {
    autocomplete: {
      control: { type: "text" },
      description: 'Set to `"off"` to disable (or pass `false` in code).',
    },
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
    },
    resize: {
      control: { type: "select" },
      options: ["vertical", "none"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  title: "Control/Textarea",
};

export default meta;

export const Default = {
  args: {
    autocomplete: "off",
    description: "Description",
    disabled: false,
    id: "textareaId",
    invalid: false,
    inlineSize: "fit",
    label: "Label",
    name: "",
    readOnly: false,
    required: false,
    resize: "vertical",
    rows: 2,
    size: "md",
    spellcheck: false,
    value: "Value",
  } satisfies ClbrTextareaProps,
  render: (args: ClbrTextareaProps) =>
    renderClbrTextarea({
      ...args,
      id: args.id?.trim() || "storybook-fallback-textarea-id",
    }),
};
