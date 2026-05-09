---
"@measured/calibrate-skills": patch
---

compose-first: pass `headerSize: "lg"` (core) / `headerSize="lg"` (react) on Page in the full-page examples to match the new Page default behaviour. The previous default mapped to ~72/84px header band; under the new `"sm" | "md" | "lg"` enum, that height now requires `"lg"` explicitly.
