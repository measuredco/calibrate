---
"@measured/calibrate-system": minor
"@measured/calibrate-tokens": minor
---

Author `$description` coverage across every semantic token in `msrd` and `base`. Descriptions follow a consistent role-anchor pattern, ground examples in actual core usage, and avoid CSS-specific syntax so they read sensibly across platforms (CSS, JSON, design tools). A few small structural changes shipped alongside: `background.inverse` is removed (use surface context instead), `typeStep.100` / `typeStep.150` split into a tight/loose-leading pair, and default steps are marked on the `spacing.vertical`, `spacing.horizontal`, and `layout.spacing.vertical` ramps.
