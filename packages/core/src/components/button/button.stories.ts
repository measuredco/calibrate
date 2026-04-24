import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import {
  CLBR_BUTTON_SPEC,
  type ClbrButtonProps,
  renderClbrButton,
} from "./button";

const baseArgTypes = specToArgTypes(CLBR_BUTTON_SPEC);

const iconArgType = {
  ...baseArgTypes.icon,
  control: { type: "select" as const },
  options: CLBR_ICON_RECOMMENDED,
};

const buttonArgTypes = {
  ...baseArgTypes,
  icon: iconArgType,
};

const meta = {
  argTypes: buttonArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_BUTTON_SPEC),
      },
    },
  },
  title: "Control/Button",
};

export default meta;

export const Button = {
  args: {
    appearance: "outline",
    controls: "",
    disabled: false,
    disclosure: false,
    form: "",
    haspopup: undefined,
    icon: undefined,
    iconMirrored: undefined,
    iconPlacement: "start",
    id: "",
    label: "Button",
    labelVisibility: "visible",
    name: "",
    size: "md",
    tone: "default",
    type: "button",
    value: "",
  } satisfies ClbrButtonProps,
  argTypes: buttonArgTypes,
  render: (args: ClbrButtonProps) =>
    renderClbrButton({
      ...args,
      form: args.form || undefined,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
      name: args.name || undefined,
      value: args.value || undefined,
    }),
};
