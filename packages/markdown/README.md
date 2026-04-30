# `@measured/calibrate-markdown`

Opinionated GitHub Flavored Markdown → safe HTML utility.

## Install

```sh
pnpm add @measured/calibrate-markdown
```

## Usage

Two named exports cover full-document and inline rendering.

```ts
import {
  processMarkdown,
  processMarkdownInline,
} from "@measured/calibrate-markdown";

const html = processMarkdown("# Hello\n\nMarkdown **rocks**.");
const inline = processMarkdownInline("a **bold** label");
```

Both return an HTML string.

## Features

- GFM extensions: tables, task lists, strikethrough, autolinks, footnotes
- Heading `id` slugs (for in-page anchor links)
- Inline color chip swatches for color literals (`#ff69b4`, `hotpink`, …)
- Syntax highlighting on fenced code blocks (highlight.js class names)
- Defensive sanitization (XSS hardening on the output HTML)

`processMarkdownInline` is for rendering markdown _inside_ a single block-level HTML element (e.g. `<p>`, `<figcaption>`) where nested block elements would produce invalid HTML. The output is restricted to a small set of inline tags; headings, paragraphs, lists, and code blocks are stripped.

## Sanitization

The pipeline runs `rehype-sanitize` over the output. The default schema permits:

- highlight.js classes on `<code>` and `<span>`
- color-chip class and inline `style` for color swatches
- Standard GFM elements

Sanitization is a defensive default. The package assumes markdown source is trusted (authored, agent-generated, or reviewed) but still scrubs the output to harden against XSS in the rare case untrusted markdown reaches the renderer. Adversarial input (CMS user content, comment systems, third-party feeds) requires its own input controls upstream — the sanitize layer here is a safety net, not a primary line of defence.

## Extension

The sanitize schemas are exported so consumers building custom unified pipelines, or layering their own transforms, can extend them without re-deriving the same allowances:

```ts
import {
  sanitizeSchema,
  sanitizeInlineSchema,
} from "@measured/calibrate-markdown";
```

## Pairing with `@measured/calibrate-core`'s `prose` component

The HTML this package emits uses GFM's element set. Calibrate's `prose` component (shipped with `@measured/calibrate-core`) styles the same set, so the output drops in directly:

```ts
import { renderClbrProse } from "@measured/calibrate-core";
import { processMarkdown } from "@measured/calibrate-markdown";

const html = renderClbrProse({
  children: processMarkdown(markdown),
});
```
