import {
  specToArgTypes,
  specToComponentDescription,
  specToPropsTable,
} from "../../helpers/spec";
import {
  CLBR_GRID_ITEM_SPEC,
  CLBR_GRID_SPEC,
  type ClbrGridItemProps,
  type ClbrGridProps,
  renderClbrGrid,
  renderClbrGridItem,
} from "./grid";

const gridArgTypes = specToArgTypes(CLBR_GRID_SPEC);
const gridItemArgTypes = specToArgTypes(CLBR_GRID_ITEM_SPEC);
const gridPropsTable = specToPropsTable(CLBR_GRID_SPEC);

const meta = {
  argTypes: gridItemArgTypes,
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(CLBR_GRID_ITEM_SPEC)}\n\nDocs controls drive the first \`grid-item\` in the primary story. See \`Grid\` story below for parent \`grid\` component props.`,
      },
    },
    padding: 0,
  },
  title: "Layout/Grid",
};

export default meta;

export const Default = {
  args: {
    colSpan: 4,
    colSpanNarrow: 6,
    colSpanWide: 3,
  } satisfies ClbrGridItemProps,
  render: (args: ClbrGridItemProps) =>
    renderClbrGrid({
      children: [
        renderClbrGridItem({
          ...args,
          children: `<div class="example-content" style="min-inline-size: 3.8125rem; min-block-size: 3rem">grid-item</div>`,
        }),
        Array.from({ length: 11 })
          .map(() =>
            renderClbrGridItem({
              colSpan: 4,
              colSpanNarrow: 6,
              colSpanWide: 3,
              children: `<div class="example-content"></div>`,
            }),
          )
          .join(""),
      ].join(""),
    }),
};

export const Grid = {
  argTypes: gridArgTypes,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: `${specToComponentDescription(CLBR_GRID_SPEC)}\n\n${gridPropsTable}`,
      },
    },
  },
  render: (args: ClbrGridProps) =>
    renderClbrGrid({
      ...args,
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
    }),
};
