import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { isValidHtmlId } from "../../helpers/html";
import {
  CLBR_ICON_RECOMMENDED,
  CLBR_ICON_SPEC,
  type ClbrIconProps,
  renderClbrIcon,
} from "./icon";

const baseArgTypes = specToArgTypes(CLBR_ICON_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    name: {
      ...baseArgTypes.name,
      control: { type: "select" },
      options: CLBR_ICON_RECOMMENDED,
    },
  },
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(CLBR_ICON_SPEC)}\n\nName control uses a recommended icon subset; component supports all available icon names at https://lucide.dev/icons/.`,
      },
    },
  },
  title: "Graphic/Icon",
};

export default meta;

export const Default = {
  args: {
    ariaHidden: false,
    mirrored: undefined,
    name: "settings",
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
