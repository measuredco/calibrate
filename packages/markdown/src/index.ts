import deepmerge from "deepmerge";
import type { Root } from "hast";
import type { Schema } from "hast-util-sanitize";
import rehypeColorChips from "rehype-color-chips";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

// Allowances for `rehype-highlight` (hljs class names) and
// `rehype-color-chips` (chip class + inline background-color style).
// Required for those plugins' output to survive sanitization.
export const sanitizeSchema: Schema = deepmerge(defaultSchema, {
  attributes: {
    code: ["className", /^language-./],
    span: [
      ["className", /(^hljs-.)|(gfm-color-chip)/],
      ["style", /^background-color./],
    ],
  },
  clobberPrefix: "",
}) as Schema;

export const sanitizeInlineSchema: Schema = {
  ...sanitizeSchema,
  tagNames: ["a", "b", "br", "code", "cite", "del", "em", "i", "strong", "sup"],
};

// Make `<pre>` keyboard-focusable so users can scroll overflowing code blocks.
const rehypeAccessiblePre = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre") {
      node.properties = { ...(node.properties ?? {}), tabIndex: 0 };
    }
  });
};

export const processMarkdown = (markdown: string): string =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug)
      .use(rehypeColorChips)
      .use(rehypeHighlight)
      .use(rehypeAccessiblePre)
      .use(rehypeSanitize, sanitizeSchema)
      .use(rehypeStringify)
      .processSync(markdown),
  );

export const processMarkdownInline = (markdown: string): string =>
  String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, sanitizeInlineSchema)
      .use(rehypeStringify)
      .processSync(markdown),
  );
