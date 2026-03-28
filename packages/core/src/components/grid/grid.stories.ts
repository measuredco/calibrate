import { type ClbrGridProps, renderClbrGrid, renderClbrGridItem } from "./grid";

const meta = {
  argTypes: {
    children: { control: false },
    gap: {
      control: { type: "select" },
      options: ["default", "expanded", "none"],
    },
  },
  parameters: { padding: 0 },
  title: "Layout/Grid",
};

export default meta;

export const Default = {
  args: {
    children: Array.from({ length: 12 })
      .map(() =>
        renderClbrGridItem({
          colSpan: 4,
          colSpanNarrow: 6,
          colSpanWide: 3,
          children: `<div class="example-content"></div>`,
        }),
      )
      .join(""),
    gap: "default",
  } satisfies ClbrGridProps,
  render: (args: ClbrGridProps) => renderClbrGrid(args),
};
