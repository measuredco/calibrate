import { type ClbrSurfaceProps, renderClbrSurface } from "./surface";

const meta = {
  argTypes: {
    children: {
      control: false,
    },
    surface: {
      control: { type: "select" },
      options: ["default", "brand"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Surface toolbar global is ignored here; use Controls for surface props.",
      },
    },
    withSurface: false,
  },
  title: "Components/Surface",
};

export default meta;

const exampleContent = `<div style="padding: 1.75rem 1.25rem">Example content</div>`;

export const Default = {
  args: {
    children: exampleContent,
    surface: "default",
  },
  render: (args: ClbrSurfaceProps) => renderClbrSurface(args),
};

export const Brand = {
  args: {
    children: exampleContent,
    surface: "brand",
  },
  render: (args: ClbrSurfaceProps) => renderClbrSurface(args),
};
