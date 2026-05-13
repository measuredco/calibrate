---
"@measured/calibrate-core": patch
---

Container: drop `block-size: 100%`. Forcing every Container to fill its parent's block axis was overreach — it caused Containers in contexts that don't define a fixed block size (e.g. inside a flowing main region) to render at 0 height or stretch unexpectedly. Removing it lets Container size naturally to its content on the block axis, matching how it already sized on the inline axis.
