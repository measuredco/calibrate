# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Decide: design-language skill vs DESIGN.md (paradigm fork)

The skills package now ships two operational guardrails — `compose-first` and `custom-with-tokens` — backed by token-discipline lint enforcement in `@measured/calibrate-config/stylelint`. The remaining call is conceptual: how (or whether) to surface Calibrate's design language as a discrete artefact, on top of (or alongside) the operational skills. Two candidates, to be evaluated once the operational layers have settled in real use:

- **Design-language skill** — descriptive context about the system's principles (compositional, tokens-as-contract, brand/system/component layering), in tandem with the compose-first / custom-with-tokens skills. Stays inside the compositional paradigm.
- **DESIGN.md** — a conventional design-spec document (colors, typography, spacing, components, per the [DESIGN.md format](https://designmd.ai/what-is-design-md)) for consumers who want Calibrate's visual language as data, not via component composition. An _alternative_ paradigm, not a complement: this serves a different consumer relationship with the system.

## Next

What we could be working on next.

### Update Lucide to 1.0

## Later

Everything we could attempt given sufficient time and resources.

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev` (`apps/storybook` deploys to `http://calibrate-storybook.msrd.dev/`, could reverse proxy to `/storybook`)

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets. Allow brand selection and support tree-shaking.

### Component evolution

#### Size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button & Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.

#### Features

- Menu support for `menuitemcheckbox` and `menuitemradio`

#### Factory

- `Control/Listbox` (JS required, selection semantics)
- `Control/Select` (native select with thin styling)
- `Control/Form` (if it becomes a real stateful runtime abstraction)
- `Control/Tag` (delete, remove, select)
- `Status/Progress` (updating)
- `Status/Skeleton` (resolve to loaded)
- `Status/Toast` (dismissible, timer)
- `Structure/Accordion` (JS for exclusive)
- `Structure/Breadcrumb` (JS responsive)
- `Structure/Code` (copy to clipboard)
- `Structure/Tabs` (JS required, a11y)

### Vue framework adapter

Validate that the `packages/adapter` SPEC walker and emitter generalises by authoring a second emitter alongside `src/react`. A small archetype floor (Button, Banner, Page, Menu — pass-through + slotted + CE + events).

### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension`/`$duration` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics
  - consider extracting `resolveAllContextPermutations` into a single module-level call shared by `prepare-sd-contexts.mjs` and `prepare-json-output.mjs` — eliminates duplicate resolution and stage drift risk. May be obsolete if SD's native consumption removes the per-stage iteration entirely.

### iOS / Android token emit targets

Speculative. Style Dictionary ships built-in iOS Swift, Android XML, and Compose formats; adding them potentially an SD platform extension on top of the existing CSS pipeline.
