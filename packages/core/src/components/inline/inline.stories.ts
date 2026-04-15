import { type ClbrInlineProps, renderClbrInline } from "./inline";

const meta = {
  argTypes: {
    as: {
      control: { type: "select" },
      options: ["div", "ul"],
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    children: { control: false },
    gap: {
      control: { type: "select" },
      options: ["2xs", "xs", "sm", "md", "lg"],
    },
    justify: {
      control: { type: "select" },
      options: ["start", "center", "end", "between"],
    },
    nowrap: { control: { type: "boolean" } },
  },
  parameters: { padding: 0 },
  title: "Layout/Inline",
};

export default meta;

export const Default = {
  args: {
    as: "div",
    align: "center",
    children:
      '<div class="example-content"></div><div class="example-content" style="min-block-size: 3rem"></div><div class="example-content"></div>',
    gap: "md",
    justify: "start",
    nowrap: false,
  } satisfies ClbrInlineProps,
  render: (args: ClbrInlineProps) => renderClbrInline(args),
};
