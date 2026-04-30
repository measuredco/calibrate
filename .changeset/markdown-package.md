---
"@measured/calibrate-markdown": minor
---

Introduce `@measured/calibrate-markdown` — an opinionated GitHub Flavored Markdown → safe HTML utility, designed to pair with [`@measured/calibrate-core`](../core)'s `prose` component (loose coupling via GFM's element set).

```ts
import {
  processMarkdown,
  processMarkdownInline,
} from "@measured/calibrate-markdown";

const html = processMarkdown("# Hello\n\nMarkdown **rocks**.");
```

Pipeline: `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-slug` → `rehype-color-chips` → `rehype-highlight` → `rehype-sanitize` → `rehype-stringify`. Sanitization is a defensive default. The schemas (`sanitizeSchema`, `sanitizeInlineSchema`) are exported for consumers extending the pipeline. Standalone HTML sanitization for adversarial input is intentionally out of scope; if a use case emerges, it ships separately.
