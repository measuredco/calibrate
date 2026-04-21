import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  type ClbrGridProps,
  renderClbrGrid,
  renderClbrGridItem,
} from "../grid/grid";
import { CLBR_CARD_SPEC, type ClbrCardProps, renderClbrCard } from "./card";

const meta = {
  argTypes: specToArgTypes(CLBR_CARD_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_CARD_SPEC),
      },
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
