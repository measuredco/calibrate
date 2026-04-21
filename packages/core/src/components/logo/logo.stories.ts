import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_LOGO_SPEC, type ClbrLogoProps, renderClbrLogo } from "./logo";

const meta = {
  argTypes: specToArgTypes(CLBR_LOGO_SPEC),
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_LOGO_SPEC),
      },
    },
  },
  title: "Graphic/Logo",
};

export default meta;

export const Default = {
  args: {
    label: "Measured",
    size: "md",
    tone: "default",
    variant: "primary",
  } satisfies ClbrLogoProps,
  render: (args: ClbrLogoProps) => renderClbrLogo(args),
};
