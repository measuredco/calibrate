import { renderClbrInline } from "../inline/inline";
import { type ClbrAvatarProps, renderClbrAvatar } from "./avatar";

const meta = {
  argTypes: {
    color: {
      control: { type: "select" },
      options: [
        "neutral",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
      ],
    },
    entity: {
      control: { type: "select" },
      options: ["person", "bot", "organization", "team"],
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    src: { control: false },
  },
  title: "Graphic/Avatar",
};

export default meta;

export const Default = {
  args: {
    alt: "",
    ariaHidden: false,
    color: undefined,
    entity: undefined,
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

export const Image = {
  render: () => {
    return renderClbrInline({
      children: `${renderClbrAvatar({
        name: "Scott Boyle",
        size: "xl",
        src: "https://res.cloudinary.com/measuredco/image/upload/f_auto,q_auto,w_288/v1775330308/avatar/Scott_With_BG_800_gps3d0.jpg",
      })}${renderClbrAvatar({
        entity: "organization",
        name: "Measured",
        size: "xl",
        src: "https://res.cloudinary.com/measuredco/image/upload/v1775330242/avatar/msrd_square_dmwmkb.svg",
      })}`,
      gap: "sm",
    });
  },
};

export const Color = {
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

export const Interactive = {
  render: () =>
    renderClbrInline({
      children: `<a href="/">${renderClbrAvatar({
        name: "Link",
        size: "md",
      })}</a><button>${renderClbrAvatar({
        name: "Button",
        size: "md",
      })}</button>`,
      gap: "xs",
    }),
};
