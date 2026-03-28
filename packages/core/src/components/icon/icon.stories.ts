import {
  type ClbrIconProps,
  CLBR_ICON_RECOMMENDED,
  renderClbrIcon,
} from "./icon";
import { isValidHtmlId } from "../../helpers/html";

const meta = {
  argTypes: {
    name: {
      control: { type: "select" },
      options: CLBR_ICON_RECOMMENDED,
    },
    mirrored: {
      control: { type: "select" },
      options: ["rtl", "always"],
    },
    size: {
      control: { type: "select" },
      options: ["2xs", "xs", "sm", "md", "lg", "fill"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Name control uses a recommended icon subset; browse all available icon names at https://lucide.dev/icons/.",
      },
    },
  },
  title: "Iconography/Icon",
};

export default meta;

export const Default = {
  args: {
    ariaHidden: false,
    mirrored: undefined,
    name: "sliders-horizontal",
    size: "md",
    title: "Title",
    titleId: "title-id",
  },
  render: (args: ClbrIconProps) => {
    const normalizedArgs = { ...args };

    if (!normalizedArgs.name) {
      normalizedArgs.name = CLBR_ICON_RECOMMENDED[0];
    }
    if (args.ariaHidden === false) {
      if (!args.title?.trim())
        normalizedArgs.title = "Storybook fallback title";
      if (!args.titleId?.trim() || !isValidHtmlId(args.titleId.trim())) {
        normalizedArgs.titleId = "storybook-fallback-title-id";
      }
    }

    return renderClbrIcon(normalizedArgs);
  },
};
