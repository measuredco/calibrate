# @measured/calibrate-skills

## 0.3.0

### Patch Changes

- f08a227: Add an "About Calibrate" orientation section to the package README. Brief context for AI agents (and humans) reading skills cold: what the system is, the compositional + multi-context model, brand context disambiguation (`msrd` for production, `wrfr` for wireframes / sketches / internal tools, `base` as a structural foundation that consumers don't pick), and the brand voice for content / copy / naming decisions.

  A standalone design-language skill was considered and deliberately not authored — most of its actionable content was already encoded in tokens, components, and the operational `compose-first` / `custom-with-tokens` skills.

- 7c52969: Compose-first full-page example now passes `appOverscrollBehavior="none"` on the Root, matching app-shell layout best practice (prevents iOS/macOS rubber-band overscroll at the document root). Both flavors updated together.
- 7c52969: Polish the compose-first full-page example: switch the header `Logo` from `variant="primary"` to `variant="secondary"` (the more common pairing for compact site furniture), and tighten the footer `Box paddingBlock` from `md` to `sm`. Both flavors (`examples/core/full-page.md`, `examples/react/full-page.md`) updated together.
- 4884b80: compose-first: pass `headerBorder: "scroll"` (core) / `headerBorder="scroll"` (react) on Page in the full-page examples. Restores the bottom-border-on-stuck behaviour now that Page has decoupled border from sticky.
- 4884b80: compose-first: pass `headerSize: "lg"` (core) / `headerSize="lg"` (react) on Page in the full-page examples to match the new Page default behaviour. The previous default mapped to ~72/84px header band; under the new `"sm" | "md" | "lg"` enum, that height now requires `"lg"` explicitly.
- 62a4386: Update the live component catalog URL in `compose-first` and `custom-with-tokens` skills from `calibrate-storybook.msrd.dev` (retired) to `calibrate.msrd.dev/storybook` (the bundled docs-site deploy).

## 0.2.0

### Minor Changes

- 056f669: Author the "Compose first" skill — the canonical guardrail for AI coding agents (and humans) building sites and apps with Calibrate. The skill establishes the compose-first paradigm: reach for layout primitives (Page, Container, Stack, Inline, Box, Grid, GridItem), Surface for color context, and content components (Heading, Text, Prose, etc.) before authoring custom CSS. Worked end-to-end full-page examples ship under `examples/core/` (template-string flavor for `@measured/calibrate-core` consumers) and `examples/react/` (JSX flavor for `@measured/calibrate-react` consumers).
- 18843e4: Author the "Custom with tokens" skill — the second operational guardrail in the skills package, paired with `compose-first`. Read this when compose-first has run out and you're about to author custom markup. The skill establishes the layered model: existing components for everything that fits, custom markup + CSS for the parts no component covers, tokens for any design value, plain CSS for structural concerns. Includes guidance on picking the right token (catalog + `$description`), accessibility (contrast via tokens, the `.visually-hidden` utility, focus indicator integrity, ARIA references), CSS architecture (`:where(.clbr)` scoping, project-prefixed class names), and smell tests for when custom-with-tokens has slipped into building parallel infrastructure. Worked Stepper examples ship under `examples/core/` (template-string flavor for `@measured/calibrate-core` consumers) and `examples/react/` (TSX flavor for `@measured/calibrate-react` consumers).

  Aligns the `compose-first` skill's References section to the same shape (same four bullets — Storybook, Component SPECs, CSS catalog, JSON tokens — same wording per bullet) and routes inline component pointers through References rather than directly at Storybook, matching the dual-audience (agent + human) framing.

- 056f669: Scaffold the `@measured/calibrate-skills` package. Establishes the workspace presence and consumer install/copy story; skill content lands in subsequent changes.
