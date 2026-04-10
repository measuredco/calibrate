import { type ClbrBlockquoteProps, renderClbrBlockquote } from "./blockquote";

const meta = {
  argTypes: {
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    attribution: { control: false },
    quote: { control: false },
    size: {
      control: { type: "select" },
      options: ["md", "lg"],
    },
  },
  title: "Typographic/Blockquote",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    attribution: `<a href="http://www.germandesigners.net/designers/hans_peter_schmoller">Hans P. Schmoller</a>, in “<cite>Book Design Today</cite>”, <cite>Printing Review</cite>, Spring 1951`,
    measured: true,
    quote:
      "One more attribute the modern typographer must have: the capacity for taking great pains with seemingly unimportant detail. To him, one typographical point must be as important as one inch, and he must harden his heart against the accusation of being too fussy.",
    responsive: false,
    size: "md",
  } satisfies ClbrBlockquoteProps,
  render: (args: ClbrBlockquoteProps) => renderClbrBlockquote(args),
};
