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

/**
 * Default sanitize schema for full-document markdown rendering.
 *
 * Extends `hast-util-sanitize`'s default schema with allowances for
 * `rehype-highlight` class names on `<code>` and `<span>` (so syntax
 * highlighting survives sanitization), plus `rehype-color-chips` class
 * and inline `style` for color swatches.
 *
 * Exported so consumers (and a future sanitization companion package)
 * can extend it without re-deriving the same allowances.
 */
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

/**
 * Inline-only sanitize schema. Restricts to a small set of inline tags
 * suitable for short-form content (badges, captions, helper text).
 *
 * Exported alongside `sanitizeSchema` for the same extensibility reason.
 */
export const sanitizeInlineSchema: Schema = {
  ...sanitizeSchema,
  tagNames: ["a", "b", "br", "code", "cite", "del", "em", "i", "strong", "sup"],
};

/**
 * Renders GFM markdown to safe HTML, suitable for use inside the
 * `prose` component.
 *
 * Pipeline: parse → GFM → rehype (with raw HTML support) → slug
 * (heading ids) → color chips → syntax highlighting → sanitize.
 */
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

/**
 * Renders GFM markdown to safe inline HTML — restricted to a small set
 * of inline tags. Use for short-form content where block-level elements
 * (headings, paragraphs, lists) are inappropriate.
 */
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
