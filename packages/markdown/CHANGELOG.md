# @measured/calibrate-markdown

## 0.2.0-alpha.6

### Minor Changes

- fa59c84: Introduce `@measured/calibrate-markdown` — an opinionated GitHub Flavored Markdown → safe HTML utility, designed to pair with [`@measured/calibrate-core`](../core)'s `prose` component (loose coupling via GFM's element set).

  ```ts
  import {
    processMarkdown,
    processMarkdownInline,
  } from "@measured/calibrate-markdown";

  const html = processMarkdown("# Hello\n\nMarkdown **rocks**.");
  ```

  Pipeline: `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-slug` → `rehype-color-chips` → `rehype-highlight` → `rehype-sanitize` → `rehype-stringify`. Sanitization is a defensive default. The schemas (`sanitizeSchema`, `sanitizeInlineSchema`) are exported for consumers extending the pipeline. Standalone HTML sanitization for adversarial input is intentionally out of scope; if a use case emerges, it ships separately.

### Patch Changes

- ef1672a: Make fenced code blocks keyboard-accessible.

  `@measured/calibrate-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

  `@measured/calibrate-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.
