# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Documentation website (`apps/documentation`)

Docs site is live at `calibrate.msrd.dev` (Cloudflare Pages), consuming the published packages and bundling Storybook at `/storybook/*`. Remaining v1 work is content: foundations and skills.

#### Outstanding for v1

- Foundations pages for every token category, generated from the system
- Skills section — compositional model (folds in current `skills/README` orientation) + index of published `@measured/calibrate-skills` content; covers the "first composition" arc

#### Principles

- **Dogfood the stack.** Render the chrome with `@measured/calibrate-core`, prose with `@measured/calibrate-markdown`, islands via `defineClbr*` web components. The site is a working demo of the system it documents.
- **All msrd, neutral by default.** The docs site is rendered entirely in the `msrd` brand. Docs chrome and prose use neutral tones (and other low-saturation primitives) so brand colour stays reserved for embedded examples that genuinely need to express it. `wrfr` is not surfaced in the docs site — it remains available via the Storybook brand switcher only, for now.
- **Color scheme follows the user.** Don't pin light/dark. The site respects `prefers-color-scheme`, so a reader sees the brand the way they'd actually use it — and gets a free demonstration of how msrd handles both modes without us building a toggle.
- **Generate from the system.** Reference pages (tokens, skills, package versions) read from source-of-truth packages so they stay correct by construction. Enhanced showcases (easing curves, swatches across themes, type scale at viewport) are hand-authored where a list can't teach what they teach.
- **Versioning is deferred, not designed-in.** Until first release, the docs site is a single rolling tier at `/`. URL versioning, version selector, and per-release archives are all post-first-release work. See _Versioning architecture_ below.
- **Dogfood until it doesn't fit, then choose.** Build the docs from existing Calibrate primitives wherever they reach. When they don't, the gap is a fork: if the need is **tightly coupled to docs use cases** (token swatch grid, easing-curve visualiser, type-scale ruler, version selector chrome) build it locally inside `apps/documentation`. If the need is **generally useful** (code block with copy, sticky TOC, doc-flavoured callouts) promote it to `@measured/calibrate-core` as a first-class component. Bias slightly toward "local first, promote later" — easier to harvest a proven local component than to retract a premature first-class one.

#### Versioning architecture (deferred)

URL versioning is deferred until we have an actual released version to distinguish from `main`. Until then, the docs site serves a single rolling tier from `/` (built from `main`). Storybook follows the same model — single rolling artifact at `/storybook/`, bundled into the docs deploy, not version-archived.

**When versioning lands** (post first release), three tiers, npm-idiomatic naming:

- **Latest** — most recent released version. Canonical for shared links and SEO. Lives at `/`.
- **Next** — built from `main`. May include unreleased changes. Lives at `/next/*`.
- **Pinned** — older releases. Lives at `/v0.3/*`, `/v0.2/*`, etc.

At that cutover, current `/` content shifts from "main rolling" to "most recent release", and main moves to `/next/*`. Some shared links to `/foo` will shift in meaning (rolling-main → release-pinned-latest). We accept that — pre-release URLs aren't a stable contract.

**Build pipeline at release time:** each release builds the docs **once** and publishes the static output to an immutable archive (R2 bucket, dedicated CF Pages project, or equivalent). The archive is never rebuilt — its lifetime contract is fixed. The main docs site's `_redirects` maps `/v0.x/*` to that archive origin via rewrite proxy. Branch / PR builds use Cloudflare Pages branch previews (ephemeral) — same as today.

**Held over from the deferred work:**

- Version selector slot in the chrome — not yet placed; add when Latest exists alongside Next
- Sitemap, canonical, og tag interpolation per active version
- Search per-version under `/search`
- i18n lang prefix decision outside version (deferred)

#### IA

- Home
- Getting started
- Foundations
  - Color
  - Typography
  - Spacing
  - Layout
  - Motion
  - Radius
  - Breakpoints
  - Effects
- Skills
- Components (v1 links out to Storybook)

#### Showcases earning their bundle in v1

- Color tokens across themes/surfaces (swatches grid)
- Easing curves (visual + drag-to-preview)
- Type scale (live samples at viewport widths)
- Spacing scale (visual ruler)

#### Out of scope for v1

- Brand switcher (docs site is msrd-only; `wrfr` lives in Storybook's switcher only for now)
- Iframed Storybook components inline (link-out is fine; revisit if reading flow suffers)
- Search (URL shape reserved — see _Other shapes worth reserving_)
- Multi-version rendering (deferred — see _Versioning architecture_)
- Changelog page (GitHub releases / changeset PRs already cover this)
- Color-scheme toggle (architecture handles this — site follows `prefers-color-scheme`)

## Next

What we could be working on next.

## Later

Everything we could attempt given sufficient time and resources.

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets. Allow brand selection and support tree-shaking.

### Component evolution

#### Size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button & Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.

#### Features

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
