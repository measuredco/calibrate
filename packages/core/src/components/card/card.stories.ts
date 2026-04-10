import { type ClbrCardProps, renderClbrCard } from "./card";

const meta = {
  argTypes: {
    headingLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand"],
    },
  },
  title: "Structure/Card",
};

export default meta;

export const Default = {
  args: {
    description: "Description",
    headingLevel: 3,
    href: "#",
    note: "Read",
    surface: undefined,
    title: "Title",
  } satisfies ClbrCardProps,
  render: (args: ClbrCardProps) => renderClbrCard(args),
};
