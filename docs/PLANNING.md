# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

### Shared config package evolution

Expand `@measured/calibrate-config` from the current browserslist/esbuild baseline into a real consumer-installable enforcement surface, so apps and sites built on Calibrate share the same hygiene and token discipline by default.

**Phase 1 — initial subpath presets (shipped).** `@measured/calibrate-config/eslint` and `@measured/calibrate-config/stylelint` exposed as subpath presets, monorepo root configs consume them, two presets land with deliberately different stances (see _Shape decisions_).

**Phase 2 — Stylelint token guards (shipped).** Global disallow-list rules surface raw color values, absolute lengths, raw time units, and `!important` repo-wide. Coverage is value-token based, so composite shorthand properties (`transition`, `box-shadow`, `border`, `background`, etc.) are caught naturally — the rules scan unit suffixes / hex literals / function names / named colours wherever they appear.

**Still ahead.**

- **`must use a token` enforcement.** Today's rules ban raw values; they don't _require_ a `var(--clbr-*)` reference where one would be appropriate. `border: 1px solid` (no colour) passes silently, as does `var(--non-clbr-foo)`. Both want a small custom Stylelint plugin.
- **JSX token-discipline rule for ESLint.** Equivalent of the Stylelint colour/length guards but for `style={{ color: "#fff" }}` patterns. Off-the-shelf options don't exist; custom rule.
- **`no-restricted-imports` for Calibrate internals.** Stop consumers depending on `@measured/calibrate-core/dist/internal/*`-style paths once we have a public/internal split.

**Shape decisions.**

- One canonical preset per tool (no `recommended` vs `strict` tiers — every config knob is a place for drift).
- Subpath exports (`@measured/calibrate-config/eslint`, `@measured/calibrate-config/stylelint`) so consumers cherry-pick what they need.
- **Stylelint = drop-in baseline.** Extends `stylelint-config-standard` and adds `stylelint-order` plus token-discipline rules (no raw colors, no absolute lengths, no raw time, no `!important`). Adopted via `extends: ["@measured/calibrate-config/stylelint"]` — the canonical Stylelint shareable-config pattern. Future rules layer additively without changing the adoption shape.
- **ESLint = Calibrate-domain placeholder.** Ships only Calibrate-flavored opinions (currently just `simple-import-sort`); consumers compose with their own TS / JSON / JS baseline. Bundling commodity rules (`tseslint.recommended`, `@eslint/json`, etc.) would lock consumers into specific choices that aren't really Calibrate's, and ESLint's multi-language surface makes a true drop-in impractical anyway. The preset will grow as genuine JS/TS-domain rules emerge (see _Still ahead_). The minimal current shape is the point, not a temporary stage.
- The asymmetry between the two presets is deliberate and reflects a real tool difference (Stylelint is narrow / CSS-only; ESLint is broad / multi-language). It is not a tier system — neither preset has a `recommended` vs `strict` variant.
- `eslint` and `stylelint` declared as `peerDependencies` of `@measured/calibrate-config` with generous ranges; document tested versions explicitly. Since the monorepo also keeps them as root devDeps, move both to the pnpm catalog so the version is single-sourced. Plugin packages that are genuine implementation details of a preset (`stylelint-order`, `stylelint-config-standard`, `eslint-plugin-simple-import-sort`) ship as regular `dependencies` of the config package; commodity packages used only at the monorepo root (`@eslint/js`, `@eslint/json`, `typescript-eslint`, `globals`) stay at root devDeps.
- File/path scoping is consumer territory, not preset territory. The presets ship no `ignores`/`ignoreFiles` and no `files` globs except where the rule is genuinely scope-bound to specific languages (e.g. `simple-import-sort` to ESTree-parseable files).
- Stylelint's path resolution requires a `createRequire` workaround inside the preset for `extends`/`plugins` strings to resolve from the package's own `node_modules` rather than the consumer's directory. Documented in `packages/config/stylelint.mjs`.

**Versioning posture.** During alpha (zero consumers) we don't owe anyone a major bump for breaking lint changes — flag in the changelog and move on. Post-alpha: every rule addition that errors on previously-clean consumer code is a major bump. Set the expectation early so it's not surprising once we have real consumers.

**Out of scope for this workstream.**

- Axe / accessibility lint — better delivered as runtime / Storybook checks (we already have the latter); component-composition rules ("`<Button>` without label") are a narrow custom-rule problem worth a separate scoping pass.
- Starter assets (PR templates, checklist files) — defer to a later iteration once the lint preset shape stabilises.

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
