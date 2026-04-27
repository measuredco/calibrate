---
"@measured/calibrate-config": minor
"@measured/calibrate-core": patch
---

Add logical-CSS enforcement to the Stylelint preset (`@measured/calibrate-config/stylelint`) via `stylelint-plugin-logical-css`. Component CSS must use logical properties (`inline-size`, `block-size`, `margin-block-start`, etc.) and logical keywords (`text-align: start`, `resize: block`) over physical equivalents, so consumer code retains LTR/RTL portability for free.
