import { type ClbrDetailsProps, renderClbrDetails } from "./details";

const meta = {
  argTypes: {
    children: { control: false },
    inlineSize: {
      control: { type: "select" },
      options: ["full", "fit"],
    },
  },
  title: "Structure/Details",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    inlineSize: "fit",
    open: false,
    summary: "Summary",
  } satisfies ClbrDetailsProps,
  render: (args: ClbrDetailsProps) => renderClbrDetails({ ...args }),
};
