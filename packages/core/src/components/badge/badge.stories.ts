import { renderClbrAvatar } from "../avatar/avatar";
import { renderClbrInline } from "../inline/inline";
import { renderClbrStack } from "../stack/stack";
import { type ClbrBadgeProps, renderClbrBadge } from "./badge";

const meta = {
  argTypes: {
    floating: { control: false },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    tone: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
    },
  },
  title: "Status/Badge",
};

export default meta;

export const Default = {
  args: {
    label: "Badge",
    size: "md",
    tone: undefined,
    floating: false,
  } satisfies ClbrBadgeProps,
  render: (args: ClbrBadgeProps) => renderClbrBadge(args),
};

export const Floating = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrInline({
      children: `<button>${renderClbrAvatar({
        entity: "person",
        name: "button",
        size: "lg",
      })}${renderClbrBadge({
        floating: true,
        label: "1",
        tone: "info",
      })}</button><a href="/">${renderClbrAvatar({
        entity: "person",
        name: "link",
        size: "lg",
      })}${renderClbrBadge({
        floating: true,
        label: "1",
        tone: "info",
      })}</a>
      <button>${renderClbrAvatar({
        entity: "person",
        name: "button",
        size: "md",
      })}${renderClbrBadge({
        floating: true,
        label: "1",
        size: "sm",
        tone: "info",
      })}</button><a href="/">${renderClbrAvatar({
        entity: "person",
        name: "link",
        size: "md",
      })}${renderClbrBadge({
        floating: true,
        label: "1",
        size: "sm",
        tone: "info",
      })}</a>`,
      gap: "sm",
    }),
};

export const Tone = {
  parameters: { controls: { disable: true } },
  render: () =>
    renderClbrStack({
      children: [
        renderClbrBadge({ label: "Default" }),
        renderClbrBadge({ label: "Info", tone: "info" }),
        renderClbrBadge({ label: "Success", tone: "success" }),
        renderClbrBadge({ label: "Warning", tone: "warning" }),
        renderClbrBadge({ label: "Error", tone: "error" }),
      ].join(""),
      gap: "sm",
    }),
};
