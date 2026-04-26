import { specToArgTypes, specToComponentDescription } from "../../spec";
import {
  CLBR_CONTAINER_SPEC,
  type ClbrContainerProps,
  renderClbrContainer,
} from "./container";

const baseArgTypes = specToArgTypes(CLBR_CONTAINER_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_CONTAINER_SPEC),
      },
    },
    padding: 0,
  },
  title: "Layout/Container",
};

export default meta;

export const Default = {
  args: {
    children: `<div class="example-content"></div>`,
    gutter: "default",
    maxInlineSize: "default",
  } satisfies ClbrContainerProps,
  render: (args: ClbrContainerProps) => renderClbrContainer(args),
};
