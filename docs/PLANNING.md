# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Tokens public surface

Three coupled steps to make Calibrate tokens consumable beyond CSS — by docs, agents, and downstream tooling — while keeping pipeline complexity bounded.

**Phase 1 — extract DTCG resolver semantics from the pipeline.** Move the resolver / alias / context-merge / context-id functions from `prepare-sd-contexts.mjs` into a dedicated module exposing `resolveAllContextPermutations(resolverDoc) → Map<contextId, ResolvedTree>`. Orchestrator becomes a consumer of pre-resolved trees. Independently valuable: makes the pipeline simpler to reason about, and dramatically reduces the migration footprint when Style Dictionary lands native DTCG resolver support (see _SD DTCG 2025.10 gaps_ in Later). Regression test: byte-identical `*.contexts.json` build artifacts + byte-identical CSS dist.

**Phase 2 — promote `contexts.json` to a stable consumer JSON export.** The pipeline already produces `build/sd/*.contexts.json` files containing fully resolved tokens with `$description` and `$type` preserved — they're just internal build artifacts today. Phase 2 transforms these into a consumer-facing JSON artifact: token-centric shape (`{ "color.brand.primary": { contexts: { "light/default": "...", "dark/brand": "..." }, $type, $description } }`) so consumers can ask "what's this token's value across contexts?" without iterating, internal `dev.msrd.calibrate.bridge` metadata stripped, versioned schema header. Likely shipped as `packages/tokens` / `@measured/calibrate-tokens`. **Values stay in source units (px) rather than CSS-converted (rem)** — px is language-agnostic and DTCG-faithful; rem is a CSS-specific concept handled in the CSS pipeline.

**Phase 3 — semantic-token `$description` coverage.** Action-oriented intent guidance on every semantic token ("Use for X" / "Don't use for Y", differential against neighbouring tokens, concise). Primitive tokens skip — descriptions there mostly restate names. Quality bar over coverage: better 30 great descriptions than 100 lazy ones. The JSON export populates `$description` automatically; together they form the token-as-API surface for docs / agents / MCP.

**Out of scope here.** Style Dictionary native-resolver migration — see _SD DTCG 2025.10 gaps_ in Later, triggered when SD lands the support.

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

### Tokens evolution

#### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension`/`$duration` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics

#### Design model evolution

- Border and Transition DTCG Composites
- Consider introducing Newsreader as a serif font for prose body copy.

#### Export target evolution

1. Penpot
1. Figma
1. VS Code token lookup artifact
1. iOS
1. Android

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev` (`apps/storybook` deploys to `http://calibrate-storybook.msrd.dev/`, could reverse proxy to `/storybook`)

### Skills package (`@measured/calibrate-skills`)

Agent skills markdown. Some ideas:

- Sorting conventions that don't fit lint rules

### Architecture Decision Records (ADRs)

Add `docs/adr/` to capture significant architectural decisions.

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets.

### Content package (`@measured/calibrate-content`)

Define a dedicated content wrangling package for shared transforms and safety utilities (for example `processMarkdown`, `sanitizeHtml`) that can be reused by docs, stories, and app-layer integrations without baking parsing/sanitization into core renderers. Note: consider current `prose` a11y issues.

### MCP/API

Evaluate whether an MCP/API distribution path adds clear value beyond package and CLI workflows for token discovery and integration.

### Brand tree-shaking strategy

Define a selective-brand distribution model across tokens, core CSS, and assets/fonts so consumers can opt into single-brand payloads without breaking the default multi-brand contract.

### Stylelint token enforcement

Adopt "must reference Calibrate token" rules via [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value), or a fully custom config in the style of [`@primer/stylelint-config`](https://github.com/primer/stylelint-config).

### Private tokens in `core`

Emit a non-exported private CSS artifact from `@measured/calibrate-core` that composes `packages/system/dist/private/css/*` for discovery/debug workflows, paired with a `no-restricted-imports` rule in `@measured/calibrate-config/eslint`.

### Vue framework adapter

Validate that the `packages/adapter` SPEC walker and emitter generalises by authoring a second emitter alongside `src/react`. A small archetype floor (Button, Banner, Page, Menu — pass-through + slotted + CE + events).
