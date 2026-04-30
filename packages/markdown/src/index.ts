import deepmerge from "deepmerge";
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
