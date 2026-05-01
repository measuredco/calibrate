---
"@measured/calibrate-core": patch
---

Page: where supported (Chrome/Edge 133+), the sticky-header border now fades in only when the header is actually pinned to the viewport edge, rather than showing whenever the header is configured as sticky. Older engines keep the always-on fallback. Implemented via `@container scroll-state(stuck: block-start)` and gated behind `@supports (container-type: scroll-state)`, so no JavaScript is added.
