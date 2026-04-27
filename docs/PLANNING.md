# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

### Shared config package evolution

Expand `@measured/calibrate-config` from the current browserslist/esbuild baseline into a real consumer-installable enforcement surface, so apps and sites built on Calibrate share the same hygiene and token discipline by default.

**Phase 1 — mirror.** Ship `@measured/calibrate-config/eslint` and `@measured/calibrate-config/stylelint` as subpath presets that exactly mirror the monorepo's current configs (alphabetical CSS via stylelint-order, simple-import-sort, baseline TS/JS). Zero new rules. Pure hygiene win, validates the subpath-preset packaging shape with no semantic risk. Migrate the monorepo's root configs to consume these presets so we dogfood the shape from day one (drift between "what we ship" and "what we use" rots fast).

**Phase 2 — token guards.** Add the strict CSS rules around tokenized values: warn or error on raw hex in `color`/`background-color`, raw px in `padding`/`margin`/`gap`/`font-size`, arbitrary `var(--*)` outside the `--clbr-*` namespace. Build with stylelint built-ins where possible (`declaration-property-value-allowed-list`, `declaration-property-value-disallowed-list`, regex on `var(--…)`) before reaching for custom plugins. Apply in monorepo too, with narrow `ignoreFiles` for `**/*.tokens.json` and bridge code that legitimately emits raw values.

**Shape decisions.**

- One canonical opinionated preset per tool (no `recommended` vs `strict` tiers — every config knob is a place for drift).
- Subpath exports (`@measured/calibrate-config/eslint`, `@measured/calibrate-config/stylelint`) so consumers cherry-pick what they need.
- Treat as a "drop-in baseline" stance rather than a "composable layer" — consumers `extends:` ours and override locally if they must, rather than us trying to merge cleanly with arbitrary upstream configs.
- `eslint` and `stylelint` declared as `peerDependencies` of `@measured/calibrate-config` with generous ranges; document tested versions explicitly. Since the monorepo also keeps them as root devDeps, move both to the pnpm catalog so the version is single-sourced. Plugin packages (`stylelint-order`, `eslint-plugin-simple-import-sort`, etc.) stay as regular `dependencies` of the config package — they're implementation details of the preset, not consumer-controlled.

**Versioning posture.** During alpha (zero consumers) we don't owe anyone a major bump for breaking lint changes — flag in the changelog and move on. Post-alpha: every rule addition that errors on previously-clean consumer code is a major bump. Set the expectation early so it's not surprising once we have real consumers.

**Out of scope for this workstream.**

- Axe / accessibility lint — better delivered as runtime / Storybook checks (we already have the latter); component-composition rules ("`<Button>` without label") are a narrow custom-rule problem worth a separate scoping pass.
- Starter assets (PR templates, checklist files) — defer to a later iteration once the lint preset shape stabilises.
- Token-name lint rules and raw-value guards beyond the obvious hex/px cases — extend Phase 2 incrementally as patterns emerge.

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

- `Control/Listbox` (JS required, selection/value semantics)
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

#### Machine-readable intent

- Expand token/group `$description` coverage for intent guidance:
  - usage guidance for humans/agents
  - token selection hints and anti-pattern notes
  - context expectations where relevant
- Define structured token/group `$extensions` for machine-readable intent:
  - stable fields for tooling/agents beyond prose descriptions
  - worked examples where intent is easy to misuse

#### JSON export target

Define a stable JSON artifact contract for downstream consumers (including docs) so metadata and token data can be consumed without coupling to internal bridge/build intermediates. Likely `packages/tokens` / `@measured/calibrate-tokens`.

Note: pipeline is currently hard-coded to CSS; probably add optional `--formats` in `packages/system/scripts/pipeline/index.mjs` when implementing a second export target.

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

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev`, `apps/storybook` can deploy to `http://calibrate.msrd.dev/storybook/`

### Skills package (`@measured/calibrate-skills`)

Agent skills markdown. Candidate sorting conventions that don't fit off-the-shelf lint rules (JS object destructure, type member, object key alphabetical sorting) live here rather than as custom ESLint rules.

### Architecture Decision Records (ADRs)

Explore introducing `docs/adr/` for capturing significant architectural decisions — one markdown file per decision, structured as Context / Decision / Consequences, immutable once accepted (superseded by later ADRs rather than edited). Complementary to the future skills package: ADRs answer "why is this the way it is", skills answer "how do I do X". A small initial set could retrofit recent decisions worth preserving (lockstep versioning, changesets over alternatives, `@measured/calibrate-core` as a regular dep of react, per-package CHANGELOGs, etc.) and the pattern adopted going forward as new decisions land.

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets.

### Content package (`@measured/calibrate-content`)

Define a dedicated content wrangling package for shared transforms and safety utilities (for example `processMarkdown`, `sanitizeHtml`) that can be reused by docs, stories, and app-layer integrations without baking parsing/sanitization into core renderers.

### MCP/API

Evaluate whether an MCP/API distribution path adds clear value beyond package and CLI workflows for token discovery and integration.

### Brand tree-shaking strategy

Define a selective-brand distribution model across tokens, core CSS, and assets/fonts so consumers can opt into single-brand payloads without breaking the default multi-brand contract.

### Optional core private discovery bundle

Revisit whether `@measured/calibrate-core` should emit a non-exported private CSS artifact that composes `packages/system/dist/private/css/*` for discovery/debug workflows.

### Second framework adapter (Vue or Svelte)

Validate that the `packages/adapter` SPEC walker + emitter generalises by authoring a per-framework emitter alongside `src/react`. Scope: a small archetype floor (Button, Banner, Page, Menu — pass-through + slotted + CE + events), not a shipping target. Goal is to confirm the shared classifier and parts-based contributor pipeline aren't accidentally React-flavoured. Not planned as a permanent distribution; pure validation.

Out of scope (even as a Later item): generating the SSR renderer itself from the SPEC. SPEC's rule grammar would have to grow into a full imperative DSL to cover what `buildClbr*` does today (nested structural layout, component composition, imperative validation with specific error messages, cross-prop defaults), which trades readable JS for a custom grammar that solves a drift problem the `describeSpecConsistency` probe suite already guards. Trigger to reconsider: a non-JS SSR consumer (Rust / Go / Python templating) that needs to render Calibrate from SPEC without reimplementing each renderer natively.
