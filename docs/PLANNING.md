# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Universal `id` prop on every component

Every component in `@measured/calibrate-core` should accept an optional `id` prop. Drives analytics tracking (e.g. Plausible event selectors), fragment-URL navigation, programmatic focus / scroll-to, JS selectors, external aria refs, and serves as the test handle when needed.

**Decisions:**

- **`id`, not `data-testid`.** `id` is broader — it covers tests _and_ analytics _and_ deep linking _and_ JS selectors. Revisit `data-testid` only if a real test-isolation case surfaces (e.g. `id` semantics churn and tests need a stable handle).
- **No auto-generation.** Auto-generated ids are SSR-leaky (hydration mismatches when generation isn't deterministic). Consumer provides `id` or no `id` is rendered. Components that already require `id` for aria stay as-is.
- **Placement is semantic, per-component:**
  - **Form controls** (Input, Textarea, Range, Radios, Checkbox, Switch, Fieldset) → inner labelled element (existing behaviour preserved). Required for `<label for="...">` to work.
  - **Interactive non-form** (Button, Link) → the actual interactive element.
  - **Structural / presentational** (Box, Card, Container, Heading, Text, Banner, Alert, etc.) → outermost wrapper.

**Implementation:**

1. SPEC type + adapter walker: model `id` as a universal optional prop (consistent surface across components without per-component decoration of the shared part)
2. Per-component renderer: forward `id` to the right element per the placement rule; existing components keep their placements
3. Validate consumer-provided `id` at the component boundary — non-empty, no whitespace
4. Tests per renderer asserting `id` passes through to the right element
5. Storybook arg type at the meta level so every story exposes it for free

## Next

What we could be working on next.

### Structured `requiredWhen` in the SPEC

Today `requiredWhen` is a free-form string ("`description` is provided"). The spec consistency runner can't evaluate it, so it probes referenced props with empty/undefined values regardless. This is fine while no rule references a `requiredWhen` prop _together with_ its trigger — but when one does (e.g. an `aria-describedby` rule whose `value` template references the conditional `id` and whose `condition` references `description`), the runner explores combinations the renderer rejects with a throw.

Concrete impact today: `Checkbox`, `Switch`, and `Icon` keep their description / title id wiring in build code only, instead of also expressing it as a spec rule. That works but means the SPEC under-describes the contract that adapters / codegen could otherwise consume.

Proposed direction:

1. Make `requiredWhen` a structured condition (reuse the existing rule-condition vocabulary: `when-truthy`, `when-non-empty`, `when-equals`, etc.).
2. Have the spec consistency runner skip combos that violate it (or: assert the renderer throws as documentation of the requirement).
3. Add the omitted aria-describedby / aria-labelledby rules to Checkbox, Switch, and Icon once the runner can reason about them.

Touches: `packages/core/src/spec.ts`, `packages/core/src/test/spec.ts`, plus the three components above.

### Skills package (`@measured/calibrate-skills`)

Agent skills markdown. Some ideas:

- Sorting conventions that don't fit lint rules

## Later

Everything we could attempt given sufficient time and resources.

### Stylelint token enforcement

Adopt "must reference Calibrate token" rules via [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value), or a fully custom config in the style of [`@primer/stylelint-config`](https://github.com/primer/stylelint-config).

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev` (`apps/storybook` deploys to `http://calibrate-storybook.msrd.dev/`, could reverse proxy to `/storybook`)

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets. Allow brand selection and support tree-shaking.

### Component evolution

- Add `menuitemcheckbox`/`menuitemradio` support to `Menu`
- Add `renderPosterImage` to expose subset of `image` props in `poster` API
- Add a light theme `poster` story
- Add `image` `sources` art direction example to Storybook
- Show `page` sticky header border on scroll only

#### Component size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button & Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.

#### More components

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
