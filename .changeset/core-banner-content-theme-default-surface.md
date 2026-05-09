---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Banner: emit `data-clbr-content-theme="dark"` and switch `data-clbr-surface` from `"inverse"` to `"default"`. The banner has its own dark visual treatment regardless of surrounding surface or color scheme — the content-theme lock now expresses that directly rather than leaning on `inverse` semantics.
