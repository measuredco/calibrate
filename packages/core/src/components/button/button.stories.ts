import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { CLBR_ICON_RECOMMENDED } from "../icon/icon";
import {
  CLBR_BUTTON_SPEC,
  type ClbrButtonElementProps,
  type ClbrButtonLinkProps,
  renderClbrButton,
} from "./button";

const baseArgTypes = specToArgTypes(CLBR_BUTTON_SPEC);

const iconArgType = {
  ...baseArgTypes.icon,
  control: { type: "select" as const },
  options: [undefined, ...CLBR_ICON_RECOMMENDED],
};

const hideControls = (...names: string[]): Record<string, unknown> =>
  Object.fromEntries(
    names.map((name) => [
      name,
      { ...baseArgTypes[name], control: false, table: { disable: true } },
    ]),
  );

const buttonArgTypes = {
  ...baseArgTypes,
  icon: iconArgType,
  ...hideControls("download", "href", "rel", "target"),
  mode: { ...baseArgTypes.mode, control: false },
};

const linkArgTypes = {
  ...baseArgTypes,
  icon: iconArgType,
  ...hideControls(
    "controls",
    "disabled",
    "disclosure",
    "form",
    "haspopup",
    "name",
    "type",
    "value",
  ),
  mode: { ...baseArgTypes.mode, control: false },
};

const downloadLinkArgTypes = {
  ...linkArgTypes,
  ...hideControls("rel", "target"),
  download: { ...baseArgTypes.download, control: false },
};

const meta = {
  parameters: {
    docs: {
      description: {
        component: [
          specToComponentDescription(CLBR_BUTTON_SPEC),
          `Arg table controls are scoped to \`mode="button"\` props only. See secondary \`mode="link"\` stories below for link-specific props and behavior.`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      },
    },
  },
  title: "Control/Button",
};

export default meta;

export const ButtonMode = {
  args: {
    mode: "button",
    label: "Button",
    appearance: "outline",
    tone: "default",
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
    tone: "default",
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
    tone: "default",
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
    tone: "default",
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
