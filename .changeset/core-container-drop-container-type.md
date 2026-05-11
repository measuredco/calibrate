---
"@measured/calibrate-core": patch
---

Container: drop `container-type: inline-size`. In older Safari (still implementing the original CSS Containment spec where `container-type` implied `layout` containment), `position: fixed` descendants of a Container were getting clipped because Container was acting as their containing block. The spec change agreed in [CSSWG #10544](https://github.com/w3c/csswg-drafts/issues/10544#issuecomment-2248438355) (Jul 2024) decouples `layout` containment from container queries, but isn't yet available in older Safari versions even though `container-type` itself shows as baseline-widely-available.

Nothing in core uses `@container` queries against `.clbr-container` — Grid establishes its own container, Page's `scroll-state` query targets the header element. Removing it from Container is safe.
