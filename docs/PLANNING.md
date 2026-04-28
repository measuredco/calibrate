# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Tokens public surface

Coupled steps to make Calibrate tokens consumable beyond CSS — by docs, agents, and downstream tooling — while keeping pipeline complexity bounded.

**Phase 1 — extract DTCG resolver semantics from the pipeline.** ✅ Landed (#42). Resolver / alias / context-merge / context-id primitives extracted to `resolve-context-tree.mjs`; pipeline regression byte-identical. Gap: the planned high-level `resolveAllContextPermutations(resolverDoc) → Map<contextId, ResolvedTree>` API and orchestrator-level pre-resolution didn't land — both `prepare-sd-contexts.mjs` and `prepare-json-output.mjs` independently iterate contexts. Tracked as a follow-up below.

**Phase 2 — promote `contexts.json` to a stable consumer JSON export.** ✅ Landed (#43). Token-centric per-axis shape (`byTheme` / `bySize` / `byContext`), DTCG-faithful overlay-only values, draft-2020-12 schema at `schemas/output/tokens.v1.json`, JSON + schema exposed via subpath exports on `@measured/calibrate-system`. Source units (px) preserved. Shape divergence from original sketch: pivoted from flat `contexts: { ... }` to per-axis structured (better self-describing for agent/MCP consumers).

**Phase 3 — add `@measured/calibrate-tokens` public package.** Add a dedicated tokens package that depends on `@measured/calibrate-system` (like `core` does today) and exposes the JSON + schema artifacts as the consumer-facing API surface. system stays the source of truth for resolver / pipeline / token authoring; its existing tooling (`validate`, `verify`, build pipeline) keeps operating on `src/` and its own `dist/` unchanged. tokens reuses those outputs — no source duplication, no tooling reimplementation. Splits the boundary cleanly: tokens (data, consumer audience) vs system (infrastructure, contributor audience). Unblocks downstream work (docs site, MCP integration) that needs a clear public dep target. Alpha posture means no consumers yet, so no breaking-change risk: the right time to settle the boundary. Carved out of #43 to keep that PR focused.

**Phase 4 — semantic-token `$description` coverage.** Action-oriented intent guidance on every semantic token ("Use for X" / "Don't use for Y", differential against neighbouring tokens, concise). Primitive tokens skip — descriptions there mostly restate names. Quality bar over coverage: better 30 great descriptions than 100 lazy ones. The JSON export populates `$description` automatically; together they form the token-as-API surface for docs / agents / MCP.

**Follow-up — orchestrator pre-resolution refactor (maybe).** Close the Phase 1 gap: refactor `prepare-sd-contexts.mjs` and `prepare-json-output.mjs` from standalone scripts into modules; have `index.mjs` call `resolveAllContextPermutations` once per resolver target and pass the resolved map to both. Architectural cleanliness over correctness — current per-stage iteration works (byte-identical proves it) but duplicates resolution work and risks stage drift. Tagged "maybe" because the cost/benefit isn't clearly worth a refactor today.

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
