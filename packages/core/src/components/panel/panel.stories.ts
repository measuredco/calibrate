import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_PANEL_SPEC,
  type ClbrPanelProps,
  renderClbrPanel,
} from "./panel";

const baseArgTypes = specToArgTypes(CLBR_PANEL_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    children: { ...baseArgTypes.children, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_PANEL_SPEC),
      },
    },
  },
  title: "Structure/Panel",
};

export default meta;

export const Default = {
  args: {
    children: '<div class="example-content"></div>',
    padding: "md",
    surface: undefined,
  } satisfies ClbrPanelProps,
  render: (args: ClbrPanelProps) => renderClbrPanel(args),
};
