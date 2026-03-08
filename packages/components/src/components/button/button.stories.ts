import { renderClbrButton } from "./button";

const meta = {
  title: "Components/Button",
  tags: ["autodocs"],
};

export default meta;

export const Primary = {
  args: {
    children: "Save",
    size: "md",
    variant: "primary",
  },
  render: (args: Parameters<typeof renderClbrButton>[0]) =>
    renderClbrButton(args),
};

export const Link = {
  args: {
    children: "Read docs",
    href: "/docs",
    variant: "secondary",
  },
  render: (args: Parameters<typeof renderClbrButton>[0]) =>
    renderClbrButton(args),
};

export const Loading = {
  args: {
    children: "Loading",
    loading: true,
    variant: "primary",
  },
  render: (args: Parameters<typeof renderClbrButton>[0]) =>
    renderClbrButton(args),
};
