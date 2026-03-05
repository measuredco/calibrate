# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

- No active `Now` tasks.

## Next

What we could start work on next.

- Start a component token layer (`tokens/src/<brand>/components/...`) after pipeline + validation are stable.
  - finalize surface taxonomy contract and whether all components bind to explicit surface context
  - one component initially
  - then more

- ideas
  - maybe move resolver_sd_bridge docs to colocate with the code?
  - maybe put the 4 build scripts in a build folder with index?
  - do we still need the specs in docs?

## Later

Everything we could attempt given sufficient time and resources.

- Expand validation coverage with optional generated `tokens/dist/**` snapshot/golden checks beyond `tokens:verify`.
- Prove end-to-end token consumption in a target stylesheet/component slice.
- Evaluate introducing a neutral semantic `layout.dimension` namespace for non-axis sizing aliases (icons, square sizes, etc.).
- Evaluate adding a `layout` axis/context for full-viewport surfaces (`fullScreen` / `canvas`) and composition rules with existing `size` contexts.
- Define cross-target export contract from `tokens/dist/json/clbr.msrd.contexts.json`:
  - context selection strategy per target (full matrix vs selected contexts)
  - naming strategy per target (path-preserving vs flattened aliases)
  - mode mapping strategy (`theme`/`size`/`state`) per target format
  - type/unit coercion policy for non-CSS targets
- Prototype Penpot export adapter from resolved contexts.
- Assess Figma export pathway and required schema mapping.
- Define iOS/Android export subset and conversion rules.
- Add optional VS Code token lookup artifact generation for authoring ergonomics.

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
  - `tokens/scripts/resolve-token-sources.mjs` resolves resolver context source ordering
  - `tokens/scripts/prepare-sd-sources.mjs` merges/normalizes token sources for SD consumption
  - `tokens/scripts/prepare-sd-contexts.mjs` emits context token doc + CSS manifest
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
  - build target wired in `tokens/scripts/build.mjs`
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
