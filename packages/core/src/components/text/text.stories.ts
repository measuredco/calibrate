import { specToArgTypes, specToComponentDescription } from "../../helpers/spec";
import {
  CLBR_TEXT_SPEC,
  type ClbrTextParagraphProps,
  type ClbrTextSpanProps,
  renderClbrText,
} from "./text";

const baseArgTypes = specToArgTypes(CLBR_TEXT_SPEC);

const meta = {
  argTypes: {
    ...baseArgTypes,
    as: { ...baseArgTypes.as, control: false },
    measured: { ...baseArgTypes.measured, control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `${specToComponentDescription(CLBR_TEXT_SPEC)}\n\nDocs controls are scoped to the default \`as: "span"\` story. See Paragraph stories below for \`as: "p"\` props and behavior.`,
      },
    },
  },
  title: "Typographic/Text",
};

export default meta;

export const Default = {
  args: {
    as: "span",
    children: 'Text with <a href="/">link</a>.',
    linkVisited: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies ClbrTextSpanProps,
  render: (args: ClbrTextSpanProps) => renderClbrText({ ...args }),
};

export const Paragraph = {
  args: {
    as: "p",
    align: "start",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies ClbrTextParagraphProps,
  render: (args: ClbrTextParagraphProps) => renderClbrText({ ...args }),
};

export const ParagraphWithMarkup = {
  args: {
    as: "p",
    align: "start",
    children:
      '<em>Emphasis</em>, <code>code</code>, <del>deleted</del>, <strong>bold</strong>, and <sup>superscript</sup>. Here’s a link to <a href="https://measured.co">a website</a>.',
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies ClbrTextParagraphProps,
  render: (args: ClbrTextParagraphProps) => renderClbrText({ ...args }),
};
