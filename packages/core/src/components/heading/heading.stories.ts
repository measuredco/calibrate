import { type ClbrHeadingProps, renderClbrHeading } from "./heading";

const meta = {
  argTypes: {
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    level: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
    },
    responsive: {
      control: { type: "boolean" },
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"],
    },
  },
  title: "Components/Heading",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    children: "Heading",
    level: undefined,
    responsive: true,
    size: "md",
  } satisfies ClbrHeadingProps,
  render: (args: ClbrHeadingProps) => renderClbrHeading({ ...args }),
};
