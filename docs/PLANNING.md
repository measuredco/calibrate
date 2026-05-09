# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Documentation website (`apps/documentation`)

Stand up a docs site at `calibrate.msrd.dev` (Cloudflare Pages) that consumes the published packages and serves as the canonical reference for usage, contracts, and examples. The `apps/storybook` subdomain (`calibrate-storybook.msrd.dev`) stays as the component playground, reverse-proxied under the docs site so component links are first-party.

#### Done means (v1)

- Public site live at `calibrate.msrd.dev`
- Foundations pages for every token category, generated from the system
- Getting started flow takes a reader from install → first composition
- Concepts copy in place (compositional model, how to think about Calibrate — folds in current `skills/README` orientation)
- Skills index linking to the published `@measured/calibrate-skills` content
- Components section links out to Storybook (full reference deferred to v2)
- Site build wired into CI; deploys on every branch

#### Principles

- **Dogfood the stack.** Render the chrome with `@measured/calibrate-core`, prose with `@measured/calibrate-markdown`, islands via `defineClbr*` web components. The site is a working demo of the system it documents.
- **All msrd, neutral by default.** The docs site is rendered entirely in the `msrd` brand. Docs chrome and prose use neutral tones (and other low-saturation primitives) so brand colour stays reserved for embedded examples that genuinely need to express it. `wrfr` is not surfaced in the docs site — it remains available via the Storybook brand switcher only, for now.
- **Color scheme follows the user.** Don't pin light/dark. The site respects `prefers-color-scheme`, so a reader sees the brand the way they'd actually use it — and gets a free demonstration of how msrd handles both modes without us building a toggle.
- **Generate from the system.** Reference pages (tokens, skills, package versions) read from source-of-truth packages so they stay correct by construction. Enhanced showcases (easing curves, swatches across themes, type scale at viewport) are hand-authored where a list can't teach what they teach.
- **Versioning is reserved, not built.** Multi-version rendering is deferred, but the URL shape, chrome slot, and build pipeline assume it from day one so we don't paint ourselves in. See _Versioning architecture_ below.
- **Dogfood until it doesn't fit, then choose.** Build the docs from existing Calibrate primitives wherever they reach. When they don't, the gap is a fork: if the need is **tightly coupled to docs use cases** (token swatch grid, easing-curve visualiser, type-scale ruler, version selector chrome) build it locally inside `apps/documentation`. If the need is **generally useful** (code block with copy, sticky TOC, doc-flavoured callouts) promote it to `@measured/calibrate-core` as a first-class component. Bias slightly toward "local first, promote later" — easier to harvest a proven local component than to retract a premature first-class one.

#### Versioning architecture (reserved)

Three tiers, npm-idiomatic naming:

- **Latest** — built from the most recent released package versions. Canonical for shared links and SEO. Lives at `/`.
- **Next** — built from `main`. May include unreleased changes. Lives at `/next/*`.
- **Pinned** — built from older release tags. Lives at `/v0.3/*`, `/v0.2/*`, etc.

Branch / PR builds use Cloudflare Pages branch previews (ephemeral preview URLs); they don't get a slot in the public site.

**v1 implementation:** ship only `/next/*` (built from `main`). `/` redirects to `/next/*` during the no-release phase. Fast-follow: cut a release tag, build pinned, deploy under `/v0.x.y/*`, flip `/` to canonical Latest content. Don't over-orchestrate the cutover — getting `/next/*` correct and architecture-shaped is the v1 goal.

**Architectural commitments to honour in v1 even though we don't build the feature:**

- URL prefixing convention is decided and applied (`/next/*`, `/v0.x/*`) — no v1 page lives at an un-prefixed path expecting to stay there.
- Version selector slot is reserved in the chrome (top-bar / sidebar header) — non-interactive label like "next" in v1, becomes a real selector once Latest exists.
- Build pipeline can run against an arbitrary git ref. v1 only runs against `main`, but the build script doesn't hardcode workspace assumptions that would break when checked out at a tag.
- Generated pages read package data from installed package versions (`@measured/calibrate-tokens`, etc.) rather than reaching into workspace `src/` paths — same reading interface works at any tag.
- Sitemap, canonical, and og tags interpolate the active version from day one.

#### Other shapes worth reserving

- **Search**: `/search` (per-version, so `/v0.3/search` is a thing). Even if not built v1.
- **i18n**: if ever in scope, lang prefix outside version: `/en/v0.3/...` (default lang elided).

#### IA

- Home
- Getting started
- Foundations
  - Breakpoints
  - Color
  - Opacity
  - Shadow
  - Stroke offset (open question, if how to represent: this is not focus ring, it's the offset stroke effect seen on card)
  - Layout (open question how to break this down, as includes border, focus ring, grid, etc.)
  - Motion
  - Radius
  - Spacing
  - Typography
- Skills
- Components (v1 links out to Storybook)

#### Stack

- Build tool: **Eleventy**. Template-agnostic, registers `renderClbr*` as a renderer, plugs `calibrate-markdown` for `.md`, no client framework imposed. We're hand-rolling enough already (rendering, neutral-tone chrome, versioning); Eleventy buys us routing, watch-mode, and incremental builds without imposing a component model.
- Rendering: `@measured/calibrate-core` for page chrome (string-emitting SSR), `@measured/calibrate-markdown` for prose
- Islands: `defineClbr*` web components, hand-picked per page
- Hosting: Cloudflare Pages (matches Storybook deploy)
- Storybook reverse-proxy path: `/storybook/*` — keeps `/components/*` open for a future first-party component reference

#### Showcases earning their bundle in v1

- Color tokens across themes/surfaces (swatches grid)
- Easing curves (visual + drag-to-preview)
- Type scale (live samples at viewport widths)
- Spacing scale (visual ruler)

#### Out of scope for v1

- Brand switcher (docs site is msrd-only; `wrfr` lives in Storybook's switcher only for now)
- Iframed Storybook components inline (link-out is fine; revisit if reading flow suffers)
- Search (URL shape reserved — see _Other shapes worth reserving_)
- Multi-version rendering (URL shape and build pipeline reserved — see _Versioning architecture_)
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
