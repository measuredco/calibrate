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
  title: "Components/Button",
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
  iconOnlyBelow: {
    control: { type: "select" },
    options: ["tablet"],
  },
  iconMirrored: {
    control: { type: "select" },
    options: ["always", "rtl"],
  },
  iconPlacement: {
    control: { type: "select" },
    options: ["start", "end"],
  },
  label: {
    control: { type: "text" },
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
    options: ["brand", "neutral"],
  },
};

const buttonArgTypes = {
  ...commonArgTypes,
  disabled: {
    control: { type: "boolean" },
  },
  form: {
    control: { type: "text" },
  },
  name: {
    control: { type: "text" },
  },
  type: {
    control: { type: "select" },
    options: ["button", "submit"],
  },
  value: {
    control: { type: "text" },
  },
};

const linkArgTypes = {
  ...commonArgTypes,
  download: {
    control: false,
  },
  href: {
    control: { type: "text" },
  },
  rel: {
    control: { type: "text" },
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
    tone: "brand",
    size: "md",
    icon: undefined,
    iconPlacement: "start",
    iconOnlyBelow: undefined,
    iconMirrored: undefined,
    disabled: false,
    type: "button",
    form: "",
    name: "",
    value: "",
  } satisfies ClbrButtonElementProps,
  argTypes: buttonArgTypes,
  render: (args: ClbrButtonElementProps) =>
    renderClbrButton({
      ...args,
      form: args.form || undefined,
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
    tone: "brand",
    size: "md",
    icon: undefined,
    iconPlacement: "start",
    iconOnlyBelow: undefined,
    iconMirrored: undefined,
    rel: "noreferrer",
    target: "_self",
  } satisfies ClbrButtonLinkProps,
  argTypes: linkArgTypes,
  render: (args: ClbrButtonLinkProps) => renderClbrButton({ ...args }),
};

export const LinkModeDownload = {
  args: {
    mode: "link",
    download: true,
    label: "Download",
    href: "#",
    appearance: "outline",
    tone: "brand",
    size: "md",
    icon: "download",
    iconPlacement: "start",
    iconOnlyBelow: undefined,
    iconMirrored: undefined,
  } satisfies ClbrButtonLinkProps,
  argTypes: downloadLinkArgTypes,
  render: (args: ClbrButtonLinkProps) => renderClbrButton({ ...args }),
};

export const LinkModeNamedDownload = {
  args: {
    mode: "link",
    download: "storybook.html",
    label: "Download",
    href: "#",
    appearance: "outline",
    tone: "brand",
    size: "md",
    icon: "download",
    iconPlacement: "start",
    iconOnlyBelow: undefined,
    iconMirrored: undefined,
  } satisfies ClbrButtonLinkProps,
  argTypes: downloadLinkArgTypes,
  render: (args: ClbrButtonLinkProps) => renderClbrButton({ ...args }),
};
