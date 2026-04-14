import {
  type ClbrGridProps,
  renderClbrGrid,
  renderClbrGridItem,
} from "../grid/grid";
import { type ClbrCardProps, renderClbrCard } from "./card";

const meta = {
  argTypes: {
    headingLevel: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand", "inverse", "brand-inverse"],
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

export const Cards = {
  parameters: { controls: { disable: true } },
  args: {
    children: [
      renderClbrGridItem({
        colSpan: 4,
        colSpanNarrow: 6,
        colSpanWide: 3,
        children: renderClbrCard({
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          href: "#",
          note: "Read",
          title: "Title",
        }),
      }),
      renderClbrGridItem({
        colSpan: 4,
        colSpanNarrow: 6,
        colSpanWide: 3,
        children: renderClbrCard({
          description: "Description",
          href: "#",
          note: "Read",
          title: "Title",
        }),
      }),
    ].join(""),
    gap: "default",
  } satisfies ClbrGridProps,
  render: (args: ClbrGridProps) => renderClbrGrid(args),
};
