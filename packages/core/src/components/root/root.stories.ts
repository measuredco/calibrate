import { specToArgTypes, specToComponentDescription } from "../../spec";
import { CLBR_ROOT_SPEC, ClbrRootProps, renderClbrRoot } from "./root";

const baseArgTypes = specToArgTypes(CLBR_ROOT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(CLBR_ROOT_SPEC)}\n\nToolbar globals are ignored on this page; use controls instead.`,
      },
    },
    withRoot: false,
  },
  title: "Environment/Root",
};

export default meta;

export const Default = {
  args: {
    appOverscrollBehavior: undefined,
    appRoot: false,
    brand: "msrd",
    children: `<div style="padding: 1.75rem 1.25rem">Example content</div>`,
    dir: undefined,
    lang: "",
    theme: undefined,
  },
  render: (args: ClbrRootProps) => renderClbrRoot({ ...args }),
};
