# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

## Later

Everything we could attempt given sufficient time and resources.

### Component evolution

- Add `data-testid` and/or `id` support
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

#### Component analytics

Figure out a way to support arbitrary analytics attributes/classes without opening a general escape hatch. Note - Plausible implementation in Facet used classnames.

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

### Content package (`@measured/calibrate-content`)

Define a dedicated content wrangling package for shared transforms and safety utilities (for example `processMarkdown`, `sanitizeHtml`) that can be reused by docs, stories, and app-layer integrations without baking parsing/sanitization into core renderers. Note: consider current `prose` a11y issues.

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev` (`apps/storybook` deploys to `http://calibrate-storybook.msrd.dev/`, could reverse proxy to `/storybook`)

### Skills package (`@measured/calibrate-skills`)

Agent skills markdown. Some ideas:

- Sorting conventions that don't fit lint rules

### MCP/API

Evaluate whether an MCP/API distribution path adds clear value beyond package and CLI workflows for token discovery and integration.

### Private tokens in `core`

Emit a non-exported private CSS artifact from `@measured/calibrate-core` that composes `packages/system/dist/private/css/*` for discovery/debug workflows, paired with a `no-restricted-imports` rule in `@measured/calibrate-config/eslint`.

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets.

### Stylelint token enforcement

Adopt "must reference Calibrate token" rules via [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value), or a fully custom config in the style of [`@primer/stylelint-config`](https://github.com/primer/stylelint-config).

### Brand tree-shaking strategy

Define a selective-brand distribution model across tokens, core CSS, and assets/fonts so consumers can opt into single-brand payloads without breaking the default multi-brand contract. At that point, consider splitting `$description` out of per-brand source into a shared semantic-surface schema — descriptions describe the surface (invariant across brands), so a single-brand build (e.g. wrfr-only) shouldn't lose them.

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
