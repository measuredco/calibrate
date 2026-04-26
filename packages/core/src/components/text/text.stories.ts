import { specToArgTypes, specToComponentDescription } from "../../spec";
import { CLBR_TEXT_SPEC, type ClbrTextProps, renderClbrText } from "./text";

const baseArgTypes = specToArgTypes(CLBR_TEXT_SPEC);

const meta = {
  argTypes: baseArgTypes,
  parameters: {
    docs: {
      description: {
        component: specToComponentDescription(CLBR_TEXT_SPEC),
      },
    },
  },
  title: "Typographic/Text",
};

export default meta;

export const Default = {
  args: {
    align: "start",
    as: "span",
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/">Ut enim ad minim</a>, nostrud exercitation ullamco laboris nisi ut aliquip ex ea.',
    linkVisited: true,
    measured: true,
    responsive: false,
    size: "md",
    tone: "default",
  } satisfies ClbrTextProps,
  render: (args: ClbrTextProps) => renderClbrText({ ...args }),
};

export const Markup = {
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
  } satisfies ClbrTextProps,
  render: (args: ClbrTextProps) => renderClbrText({ ...args }),
};
