import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import { renderClbrInline } from "../inline/inline";
import {
  CLBR_AVATAR_SPEC,
  type ClbrAvatarProps,
  renderClbrAvatar,
} from "./avatar";

const baseArgTypes = specToArgTypes(CLBR_AVATAR_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_AVATAR_SPEC),
      },
    },
  },
  title: "Graphic/Avatar",
};

export default meta;

export const Default = {
  args: {
    alt: "",
    ariaHidden: false,
    color: undefined,
    entity: "person",
    initials: "",
    name: "",
    size: "md",
    src: "",
  } satisfies ClbrAvatarProps,
  render: (args: ClbrAvatarProps) => {
    const normalizedArgs = { ...args };
    const normalizedInitials = args.initials?.trim().replace(/\s+/g, " ");

    if (
      normalizedInitials &&
      (normalizedInitials.length > 3 ||
        !/^[A-Za-z]{1,3}$/.test(normalizedInitials))
    ) {
      normalizedArgs.initials = undefined;
    }

    return renderClbrAvatar(normalizedArgs);
  },
};

export const Color = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrInline({
      children: ["01", "02", "03", "04", "05", "06", "07", "08", "09"]
        .map((color) =>
          renderClbrAvatar({
            color: color as ClbrAvatarProps["color"],
            entity: "person",
            size: "md",
          }),
        )
        .join(""),
      gap: "xs",
    }),
};

export const Image = {
  parameters: { controls: { disable: true } },
  render: () => {
    return renderClbrInline({
      children: `${renderClbrAvatar({
        name: "Scott Boyle",
        size: "md",
        src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_288/v1775330308/avatar/Scott_With_BG_800_gps3d0.jpg",
      })}${renderClbrAvatar({
        entity: "organization",
        name: "Measured",
        size: "md",
        src: "https://res.cloudinary.com/measuredco/image/upload/v1775330242/avatar/msrd_square_dmwmkb.svg",
      })}`,
      gap: "xs",
    });
  },
};

export const Interactive = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrInline({
      children: `<button>${renderClbrAvatar({
        name: "Button",
        size: "md",
      })}</button><a href="#">${renderClbrAvatar({
        name: "Link",
        size: "md",
      })}</a>`,
      gap: "xs",
    }),
};
