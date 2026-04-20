import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import {
  type ClbrButtonElementProps,
  type ClbrButtonLinkProps,
  renderClbrButton,
} from "./button";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Docs controls are scoped to Button Mode props only. See secondary Link Mode stories below for link-specific props and behavior.",
      },
    },
  },
  title: "Control/Button",
};

export default meta;

const commonArgTypes = {
  appearance: {
    control: { type: "select" },
    options: ["outline", "solid", "text"],
  },
  icon: {
    control: { type: "select" },
    options: CLBR_ICON_RECOMMENDED,
  },
  iconMirrored: {
    control: { type: "select" },
    options: ["always", "rtl"],
  },
  iconPlacement: {
    control: { type: "select" },
    options: ["start", "end"],
  },
  labelVisibility: {
    control: { type: "select" },
    options: ["visible", "hidden", "hiddenBelowTablet"],
  },
  mode: {
    control: false,
  },
  size: {
    control: { type: "select" },
    options: ["sm", "md", "lg"],
  },
  tone: {
    control: { type: "select" },
    options: ["default", "neutral"],
  },
};

const buttonArgTypes = {
  ...commonArgTypes,
  haspopup: {
    control: { type: "select" },
    options: ["menu"],
  },
  type: {
    control: { type: "select" },
    options: ["button", "submit"],
  },
};

const linkArgTypes = {
  ...commonArgTypes,
  download: {
    control: false,
  },
  target: {
    control: { type: "select" },
    options: ["_blank", "_parent", "_self", "_top"],
  },
};

const downloadLinkArgTypes = {
  ...linkArgTypes,
  rel: {
    control: false,
  },
  target: {
    control: false,
  },
};

export const ButtonMode = {
  args: {
    mode: "button",
    label: "Button",
    appearance: "outline",
    tone: undefined,
    size: "md",
    labelVisibility: "visible",
    icon: undefined,
    iconPlacement: "start",
    iconMirrored: undefined,
    disabled: false,
    disclosure: false,
    haspopup: undefined,
    type: "button",
    controls: "",
    id: "",
    form: "",
    name: "",
    value: "",
  } satisfies ClbrButtonElementProps,
  argTypes: buttonArgTypes,
  render: (args: ClbrButtonElementProps) =>
    renderClbrButton({
      ...args,
      form: args.form || undefined,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
      name: args.name || undefined,
      value: args.value || undefined,
    }),
};

export const LinkMode = {
  args: {
    mode: "link",
    label: "Link",
    href: "#",
    appearance: "outline",
    tone: undefined,
    size: "md",
    icon: undefined,
    iconPlacement: "start",
    id: "",
    labelVisibility: "visible",
    iconMirrored: undefined,
    rel: "noreferrer",
    target: "_self",
  } satisfies ClbrButtonLinkProps,
  argTypes: linkArgTypes,
  render: (args: ClbrButtonLinkProps) =>
    renderClbrButton({
      ...args,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
    }),
};

export const LinkModeDownload = {
  args: {
    mode: "link",
    download: true,
    label: "Download",
    href: "#",
    appearance: "outline",
    tone: undefined,
    size: "md",
    icon: "download",
    iconPlacement: "start",
    id: "",
    labelVisibility: "visible",
    iconMirrored: undefined,
  } satisfies ClbrButtonLinkProps,
  argTypes: downloadLinkArgTypes,
  render: (args: ClbrButtonLinkProps) =>
    renderClbrButton({
      ...args,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
    }),
};

export const LinkModeNamedDownload = {
  args: {
    mode: "link",
    download: "storybook.html",
    label: "Download",
    href: "#",
    appearance: "outline",
    tone: undefined,
    size: "md",
    icon: "download",
    iconPlacement: "start",
    labelVisibility: "visible",
    iconMirrored: undefined,
  } satisfies ClbrButtonLinkProps,
  argTypes: downloadLinkArgTypes,
  render: (args: ClbrButtonLinkProps) =>
    renderClbrButton({
      ...args,
      labelVisibility: args.icon ? args.labelVisibility : "visible",
    }),
};
