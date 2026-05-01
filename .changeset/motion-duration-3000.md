---
"@measured/calibrate-tokens": minor
"@measured/calibrate-core": patch
---

Add the `motion.duration.3000` token (3s on `msrd`, 0ms on `wrfr`) for ambient / reduced-motion loops. Renames `motion.duration.600` from `Longest duration step.` to `Long duration step.` so the scale stays accurate now that `3000` is the longest.

`@measured/calibrate-core`: the spinner's `prefers-reduced-motion` pulse animation now references `var(--clbr-motion-duration-3000)` instead of a hard-coded duration.
