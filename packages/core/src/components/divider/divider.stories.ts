import { type ClbrDividerProps, renderClbrDivider } from "./divider";

const meta = {
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "subtle", "brand"],
    },
  },
  title: "Layout/Divider",
};

export default meta;

export const Default = {
  args: {
    orientation: "horizontal",
    tone: undefined,
  } satisfies ClbrDividerProps,
  render: (args: ClbrDividerProps) => renderClbrDivider(args),
};
