# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

### Build Initial Components (`packages/components`)

Requirements:

- Components that do not require JS behavior should be authored as pure SSR renderers emitting native HTML.
- Components that do require JS behavior may be authored as web-components.
- Package uses TypeScript.
- Public component contracts (renderer props and/or component attributes/properties/events) have JSDoc.
- Every component has tests (Testing Library).
- Every component has Storybook stories.
- Package uses repo-level Prettier and ESLint (including TS support).
- All component paths support SSR (render meaningful inner HTML without requiring client JS for initial render).

Current decisions/working assumptions:

- Initial stack: Vite, Vitest, Testing Library, Storybook.
- Initial primitives use pure SSR renderers (no custom-element runtime).
- Initial implemented primitives: `root` and `button` (renderer + CSS + tests + stories).
- Lit is reserved for components that need runtime JS behavior.
- Runtime web-components (when used) should use light DOM (no Shadow DOM) and keep SSR-safe inner HTML behavior.
- Distribution target: dual output (ESM + CJS) for initial compatibility.
- Browser support baseline: centralized in `@measured/calibrate-browserslist` (`baseline widely available` query + Vite/esbuild target), with PostCSS+Autoprefixer enabled in `@measured/calibrate-components`; add shims/polyfills only if a concrete requirement emerges.
- Testing depth for v1: behavior + accessibility; no visual regression in initial phase
- Storybook: package-local for now, treated as a development tool (docs-app integration can come later).
- Public API policy: full alpha mode for now (no stability guarantees until versioning/publish policy is formalized).
- Accessibility baseline target: WCAG 2.2 AA.
- Framework strategy: SSR renderer contracts first; add web-component runtime only where needed; wrappers/adapters later.
- Token CSS loading: components package auto-imports token CSS; direct tokens package consumption remains for non-component consumers.
- Initial token CSS strategy: include both brands by default for now (brand/tree-shaking optimization can follow later).
- Components package also ships a light CSS reset entrypoint that can compose token CSS imports.

Open questions to resolve:

- None currently.

## Next

### Components and Recipes

## Later

Everything we could attempt given sufficient time and resources.

### Deterministic sorting (linting)

- JS import/export ordering via ESLint autofix
- JSON key-order enforcement for selected token paths (including top-key conventions like `$schema` / `$type` / `$description` / `default`)
- Alphabetical sorting

### Machine-readable intent

- Expand token/group `$description` coverage for intent guidance:
  - usage guidance for humans/agents
  - token selection hints and anti-pattern notes
  - context expectations where relevant
- Define structured token/group `$extensions` for machine-readable intent:
  - stable fields for tooling/agents beyond prose descriptions
  - worked examples where intent is easy to misuse

### Design model evolution

- Light brand surface (current example is a duplicate of dark brand)
- Light/dark inverse surfaces
- `density` context (class-based in CSS) — current size context grid/spacing is broadly editorial/comfortable in nature, this may be fine, but may want to add a ui/compact mode
- Border and Transition DTCG Composites

### Style Dictionary DTCG 2025.10 gaps

[Support for DTCG v2025.10](https://github.com/style-dictionary/style-dictionary/issues/1590)

- Revisit bridge-side DTCG `$dimension` normalization once Style Dictionary fully supports nested `{value, unit}` in composite CSS transforms:
  - remove `normalizeDtcgValueObjects` compatibility shim from `prepare-sd-sources.mjs` when safe
- Revisit resolver bridge scope once Style Dictionary lands native DTCG resolver support:
  - reduce/remove custom resolver->SD source adaptation where SD can natively consume resolver semantics

### Export target evolution

1. Penpot
1. VS Code token lookup artifact
1. Figma
1. iOS
1. Android

Note: pipeline is currently hard-coded to CSS; probably add optional `--formats` in `packages/tokens/scripts/pipeline/index.mjs` when implementing a second export target.

### JSON export target

Define a stable JSON artifact contract for downstream consumers (including docs) so metadata and token data can be consumed without coupling to internal bridge/build intermediates.

### Minimal viable publish

Define the minimum scripts, workflow, and release notes needed to publish initial alpha packages and unblock downstream adoption tasks.

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples.

### Assets package

Decide whether shared fonts/images should ship as a dedicated package and define what is stable asset API vs implementation detail.

### CLI bootstrap tool

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets.

### Framework adapters

Identify the minimum adapter surface needed to consume token/component contracts ergonomically across target frameworks.

### MCP/API

Evaluate whether an MCP/API distribution path adds clear value beyond package and CLI workflows for token discovery and integration.

## Done

What we've done.

_This section is a historical completion record; some entries may describe decisions or intermediate states that were later refined._

- Phase complete: Semantic API baseline (core + brand semantic coverage, responsive semantics included).
- semantic color theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic color theme files include `base16` groups (`00`..`0F`) with hex descriptions.
- semantic effect theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic effect files now expose `opacity.demoted` mapped from `primitive.effect.opacity.40`.
- semantic folder structure is axis-first for color/effect, with typography and layout using `size` contexts.
- semantic spacing now exposes root non-size scales (`vertical`, `horizontal`) in `packages/tokens/src/core/semantic/spacing.tokens.json`.
- responsive vertical rhythm moved to `layout/size/*` as `verticalSpacing` (not duplicated in spacing size files).
- layout grid gap semantics authored by size context (`baseline`, `tablet`, `laptop`), with `laptop` currently override-only.
- layout vertical spacing escalation now begins at `notebook` (split from `tablet`).
- contextual spacing key parity adopted for layout vertical ramps (matching root spacing keys where practical).
- primitive motion includes duration ramp in `ms` (`50`, `100`, `150`, `200`, `300`) and semantic motion exposes it.
- typography prose link decoration normalized to state-first offsets:
  - `typography.prose.link.hover.decoration.offset`
  - `typography.prose.link.active.decoration.offset`
  - shared `typography.prose.link.decoration.thickness`.
- semantic typography baseline/tablet size files populated for body + heading scales.
- brand `shape` domain introduced (`square.aspectRatio`, `square.cornerRatio`) with semantic exposure.
- external typography size `$ref` paths corrected to current folder structure.
- source token tree moved under `packages/tokens/src` (core + brand).
- spec-shaped resolver manifest added at `packages/tokens/resolver/msrd.resolver.json` with `resolutionOrder`.
- DTCG schemas vendored under `packages/tokens/schemas/2025.10` and local `$schema` paths applied across authored token/resolver files.
- Style Dictionary bridge/pipeline implemented:
  - `packages/tokens/scripts/pipeline/resolve-token-sources.mjs` resolves resolver context source ordering
  - `packages/tokens/scripts/pipeline/prepare-sd-sources.mjs` merges/normalizes token sources for SD consumption
  - `packages/tokens/scripts/pipeline/prepare-sd-contexts.mjs` emits context token doc + CSS manifest
  - `packages/tokens/style-dictionary.config.mjs` formats CSS from generated context + manifest inputs
- Resolver->SD boundary refactor completed (bridge outputs SD-ready with minimal SD-config shaping):
  - formatter path-index assumptions removed in favor of bridge metadata (`dev.msrd.calibrate.bridge`)
  - public/private split now handled by SD role filters
  - single SD run per target for public+private outputs
  - docs and constraints updated to reflect current bridge contract and temporary SD `$dimension` compatibility shim
- Output contracts established:
  - committed/public outputs in `packages/tokens/dist/{css,json}`
  - disposable pipeline artifacts in `packages/tokens/build/{sd,tmp}`
- Resolver->SD bridge API and docs stabilized:
  - adapter keys documented (`baseContext`, `deltaFromContext`, selector refs, variant defaults)
  - naming and authoring conventions documented for future brands/modifiers
- Artifact policy decided and enforced:
  - `packages/tokens/dist/**` is versioned/public
  - `packages/tokens/build/**` is disposable
  - `tokens:verify` added to fail when `packages/tokens/dist/**` is out of date after build
- Multi-brand packaging/layering foundation implemented:
  - `core` and `msrd` outputs now build independently
  - core artifacts: `packages/tokens/dist/css/clbr.core.tokens.css`, `packages/tokens/build/sd/clbr.core.contexts.json`
  - msrd artifacts: `packages/tokens/dist/css/clbr.msrd.tokens.css`, `packages/tokens/build/sd/clbr.msrd.contexts.json`
  - deterministic CSS layering emitted via `@layer clbr, clbr.brand;`
- Wireframe brand onboarding completed:
  - resolver added: `packages/tokens/resolver/wrfr.resolver.json`
  - brand source added under `packages/tokens/src/wrfr/{primitive,semantic}`
  - build target wired in `packages/tokens/scripts/pipeline/index.mjs`
  - brand artifacts emit and verify:
    - `packages/tokens/dist/css/clbr.wrfr.tokens.css`
    - `packages/tokens/build/sd/clbr.wrfr.contexts.json`
- Consumer include/override strategy documented in constraints:
  - load contract for `core` + brand bundles
  - scoped multi-brand usage on one page
  - class contracts for brand/theme/surface selectors
- Baseline validation + CI checks implemented:
  - `tokens:validate` added for authored token/resolver JSON checks and resolver-context preparation checks
  - CI workflow added at `.github/workflows/tokens.yml`
  - CI runs:
    - `pnpm run tokens:validate`
    - `pnpm run tokens:verify`
- Optional private primitive output implemented for maintainer/discovery workflows:
  - output path: `packages/tokens/dist/private/css/`
  - file naming: `clbr.<brand>.primitives.css`
  - variable guard prefix: `--clbr-primitive-*`
  - documented as non-public/non-stable contract (semantic remains the public API)
- Authoring ergonomics for context declarations improved:
  - sparse/override-only context files are supported as first-class authoring for cumulative axes
  - `theme` source composition now uses cumulative `baseContext` inheritance (aligned with `size`)
  - constraints now document when duplicate declarations should be retained (alias-anchor/readability cases)
- Resolver bridge docs now co-locate with bridge code:
  - canonical bridge doc lives at `packages/tokens/scripts/README.md`
- Bridge scripts now use a dedicated subfolder structure:
  - pipeline scripts moved to `packages/tokens/scripts/pipeline/*`
  - build entrypoint is `packages/tokens/scripts/pipeline/index.mjs`
- Vendored DTCG spec reference docs relocated under `packages/tokens/schemas/2025.10/spec`.
- ESLint and Prettier baseline tooling added:
  - `eslint` configured via `eslint.config.mjs` for token pipeline scripts
  - `prettier` configured via `.prettierrc.json` and `.prettierignore`
  - scripts added in `package.json`: `lint`, `lint:fix`, `format`, `format:check`
- Component token layer architecture proved with Card pilot:
  - `packages/tokens/src/<brand>/component/...` path shape integrated into resolver->SD bridge
  - component tokens resolve across theme/surface/state contexts with correct diff behavior
  - forced-colors component overrides emit correctly without leaking unrelated semantic tokens
  - output naming and scoping conventions validated in generated CSS
- Card and `wrfr` are intentionally retained as architecture probes for now:
  - Card remains in-tree to validate component-theme/surface/state support and resolver->SD behavior
  - `wrfr` remains in-tree to validate multi-brand packaging and runtime scoping patterns
- Monorepo architecture baseline completed (pnpm workspace, lockstep versioning):
  - `pnpm-workspace.yaml` added with `packages/*`
  - tokens package moved to `packages/tokens` with package-local build/validate/verify scripts
  - root scripts now delegate via workspace filters (`@measured/calibrate-tokens`)
  - `packages/components` scaffold added as the next package boundary
