import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_SURFACE_SPEC,
  type ClbrSurfaceProps,
  renderClbrSurface,
} from "./surface";

const baseArgTypes = specToArgTypes(CLBR_SURFACE_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_SURFACE_SPEC),
      },
    },
    withSurface: false,
  },
  title: "Environment/Surface",
};

export default meta;

const exampleContent = `<div style="padding: 1.75rem 1.25rem">Example content</div>`;

export const Default = {
  args: {
    children: exampleContent,
    variant: "default",
  } satisfies ClbrSurfaceProps,
  render: (args: ClbrSurfaceProps) => renderClbrSurface(args),
};
