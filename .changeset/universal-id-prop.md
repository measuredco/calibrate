---
"@measured/calibrate-core": minor
---

Add an optional `id` prop to structural components: `Box`, `Card`, `Heading`, `Text`, `Banner`, `Container`. The id is placed on the outermost host element and validated against the HTML id syntax. Consumers retain control of id generation; the renderer never auto-generates ids to avoid SSR/hydration leaks.

This establishes the pattern for a follow-up workstream that will bring the same `id` support to the remaining components in the package.
