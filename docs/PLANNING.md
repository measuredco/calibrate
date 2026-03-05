# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could start work on next.

- install and configure eslint and prettier
- key sort order in tokens/src

## Later

Everything we could attempt given sufficient time and resources.

- Expand validation coverage with optional generated `tokens/dist/**` snapshot/golden checks beyond `tokens:verify`.
- Add machine-readable intent metadata across semantic tokens/groups:
  - usage guidance for humans/agents
  - token selection hints and anti-pattern notes
  - context expectations where relevant
- Prove end-to-end token consumption in a target stylesheet/component slice.
- Define and prototype framework-agnostic component recipes/specs:
  - canonical HTML snippets and usage patterns aligned with token API
  - evaluate web-component-style specs as recipe artifacts
  - assess adapter paths from canonical recipes to framework-specific implementations
- Component expansion follow-up (recipe-led, not token-first):
  - validate second-component patterns via recipes/specs before adding broader component token APIs
  - only promote reusable component-axis/context tokens where recipe evidence shows clear value
- Evaluate introducing a neutral semantic `layout.dimension` namespace for non-axis sizing aliases (icons, square sizes, etc.).
- Evaluate adding a `layout` axis/context for full-viewport surfaces (`fullScreen` / `canvas`) and composition rules with existing `size` contexts.
- Define cross-target export contract from `tokens/dist/json/clbr.msrd.contexts.json`:
  - context selection strategy per target (full matrix vs selected contexts)
  - naming strategy per target (path-preserving vs flattened aliases)
  - mode mapping strategy (`theme`/`size`/`state`) per target format
  - type/unit coercion policy for non-CSS targets
- Add optional VS Code token lookup artifact generation for authoring ergonomics.
- Prototype Penpot export adapter from resolved contexts.
- Assess Figma export pathway and required schema mapping.
- Define iOS/Android export subset and conversion rules.

## Done

What we've done.

- Phase complete: Semantic API baseline (core + brand semantic coverage, responsive semantics included).
- semantic color theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic color theme files include `base16` groups (`00`..`0F`) with hex descriptions.
- semantic effect theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic effect files now expose `opacity.demoted` mapped from `primitive.effect.opacity.40`.
- semantic folder structure is axis-first for color/effect, with typography and layout using `size` contexts.
- semantic spacing now exposes root non-size scales (`vertical`, `horizontal`) in `tokens/src/core/semantic/spacing.tokens.json`.
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
- source token tree moved under `tokens/src` (core + brand).
- spec-shaped resolver manifest added at `tokens/resolver/msrd.resolver.json` with `resolutionOrder`.
- DTCG schemas vendored under `tokens/schemas/2025.10` and local `$schema` paths applied across authored token/resolver files.
- Style Dictionary bridge/pipeline implemented:
  - `tokens/scripts/pipeline/resolve-token-sources.mjs` resolves resolver context source ordering
  - `tokens/scripts/pipeline/prepare-sd-sources.mjs` merges/normalizes token sources for SD consumption
  - `tokens/scripts/pipeline/prepare-sd-contexts.mjs` emits context token doc + CSS manifest
  - `tokens/style-dictionary.config.mjs` formats CSS from generated context + manifest inputs
- Output contracts established:
  - committed/public outputs in `tokens/dist/{css,json}`
  - disposable pipeline artifacts in `tokens/build/{sd,tmp}`
- Resolver->SD bridge API and docs stabilized:
  - adapter keys documented (`baseContext`, `deltaFromContext`, selector refs, variant defaults)
  - naming and authoring conventions documented for future brands/modifiers
- Artifact policy decided and enforced:
  - `tokens/dist/**` is versioned/public
  - `tokens/build/**` is disposable
  - `tokens:verify` added to fail when `tokens/dist/**` is out of date after build
- Multi-brand packaging/layering foundation implemented:
  - `core` and `msrd` outputs now build independently
  - core artifacts: `tokens/dist/css/clbr.core.tokens.css`, `tokens/dist/json/clbr.core.contexts.json`
  - msrd artifacts: `tokens/dist/css/clbr.msrd.tokens.css`, `tokens/dist/json/clbr.msrd.contexts.json`
  - deterministic CSS layering emitted via `@layer clbr, clbr.brand;`
- Wireframe brand onboarding completed:
  - resolver added: `tokens/resolver/wrfr.resolver.json`
  - brand source added under `tokens/src/wrfr/{primitive,semantic}`
  - build target wired in `tokens/scripts/pipeline/index.mjs`
  - brand artifacts emit and verify:
    - `tokens/dist/css/clbr.wrfr.tokens.css`
    - `tokens/dist/json/clbr.wrfr.contexts.json`
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
  - output path: `tokens/dist/private/css/`
  - file naming: `clbr.<brand>.primitives.css`
  - variable guard prefix: `--clbr-primitive-*`
  - documented as non-public/non-stable contract (semantic remains the public API)
- Authoring ergonomics for context declarations improved:
  - sparse/override-only context files are supported as first-class authoring for cumulative axes
  - `theme` source composition now uses cumulative `baseContext` inheritance (aligned with `size`)
  - constraints now document when duplicate declarations should be retained (alias-anchor/readability cases)
- Resolver bridge docs now co-locate with bridge code:
  - canonical bridge doc lives at `tokens/scripts/pipeline/README.md`
- Bridge scripts now use a dedicated subfolder structure:
  - pipeline scripts moved to `tokens/scripts/pipeline/*`
  - build entrypoint is `tokens/scripts/pipeline/index.mjs`
- Vendored DTCG spec reference docs relocated under `tokens/schemas/2025.10/spec`.
- Component token layer architecture proved with Card pilot:
  - `tokens/src/<brand>/component/...` path shape integrated into resolver->SD bridge
  - component tokens resolve across theme/surface/state contexts with correct diff behavior
  - forced-colors component overrides emit correctly without leaking unrelated semantic tokens
  - output naming and scoping conventions validated in generated CSS
- Card and `wrfr` are intentionally retained as architecture probes for now:
  - Card remains in-tree to validate component-theme/surface/state support and resolver->SD behavior
  - `wrfr` remains in-tree to validate multi-brand packaging and runtime scoping patterns
