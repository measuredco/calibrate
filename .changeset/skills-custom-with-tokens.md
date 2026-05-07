---
"@measured/calibrate-skills": minor
---

Author the "Custom with tokens" skill — the second operational guardrail in the skills package, paired with `compose-first`. Read this when compose-first has run out and you're about to author custom markup. The skill establishes the layered model: existing components for everything that fits, custom markup + CSS for the parts no component covers, tokens for any design value, plain CSS for structural concerns. Includes guidance on picking the right token (catalog + `$description`), accessibility (contrast via tokens, the `.visually-hidden` utility, focus indicator integrity, ARIA references), CSS architecture (`:where(.clbr)` scoping, project-prefixed class names), and smell tests for when custom-with-tokens has slipped into building parallel infrastructure. Worked Stepper examples ship under `examples/core/` (template-string flavor for `@measured/calibrate-core` consumers) and `examples/react/` (TSX flavor for `@measured/calibrate-react` consumers).

Aligns the `compose-first` skill's References section to the same shape (same four bullets — Storybook, Component SPECs, CSS catalog, JSON tokens — same wording per bullet) and routes inline component pointers through References rather than directly at Storybook, matching the dual-audience (agent + human) framing.
