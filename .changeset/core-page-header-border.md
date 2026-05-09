---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Page: add `headerBorder` prop, decoupling the header bottom border from `stickyHeader`.

- `headerBorder="always"` — persistent border
- `headerBorder="scroll"` — border fades in only when a sticky header is stuck (uses `@container scroll-state(stuck: block-start)`); falls back to always-on where the container query isn't supported. Has no visible effect without `stickyHeader`.
- omitted — no border (was: a border was implicitly emitted whenever `stickyHeader` was set)

**Visual change:** `stickyHeader` no longer implies a border. Pass `headerBorder="scroll"` (or `"always"`) explicitly to keep the previous look.
