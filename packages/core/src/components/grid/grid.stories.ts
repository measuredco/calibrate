import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_GRID_SPEC,
  type ClbrGridProps,
  renderClbrGrid,
  renderClbrGridItem,
} from "./grid";

const baseArgTypes = specToArgTypes(CLBR_GRID_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_GRID_SPEC),
      },
    },
    padding: 0,
  },
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
