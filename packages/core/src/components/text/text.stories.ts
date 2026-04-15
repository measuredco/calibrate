import {
  type ClbrTextParagraphProps,
  type ClbrTextSpanProps,
  renderClbrText,
} from "./text";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          'Docs controls are scoped to `as: "span"` props only. See the secondary Paragraph stories below for `as: "p"` props and behavior.',
      },
    },
  },
  title: "Typographic/Text",
};

export default meta;

const sharedArgTypes = {
  as: { control: false },
  linkVisited: {
    control: { type: "boolean" },
  },
  size: {
    control: { type: "select" },
    options: ["xs", "sm", "md", "lg"],
  },
  tone: {
    control: { type: "select" },
    options: ["default", "muted"],
  },
};

export const Default = {
  argTypes: {
    ...sharedArgTypes,
  },
  args: {
    as: "span",
    children: 'Text with <a href="/">link</a>.',
    linkVisited: true,
    responsive: false,
    size: "md",
    tone: undefined,
  } satisfies ClbrTextSpanProps,
  render: (args: ClbrTextSpanProps) => renderClbrText({ ...args }),
};

export const Paragraph = {
  argTypes: {
    ...sharedArgTypes,
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
  },
  args: {
    as: "p",
    align: "start",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: undefined,
  } satisfies ClbrTextParagraphProps,
  render: (args: ClbrTextParagraphProps) => renderClbrText({ ...args }),
};

export const ParagraphWithMarkup = {
  argTypes: {
    ...sharedArgTypes,
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
  },
  args: {
    as: "p",
    align: "start",
    children:
      '<em>Emphasis</em>, <code>code</code>, <del>deleted</del>, <strong>bold</strong>, and <sup>superscript</sup>. Here’s a link to <a href="https://measured.co">a website</a>.',
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: undefined,
  } satisfies ClbrTextParagraphProps,
  render: (args: ClbrTextParagraphProps) => renderClbrText({ ...args }),
};
