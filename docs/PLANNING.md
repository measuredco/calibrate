# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

- Implement Style Dictionary 4 adapter/pipeline using resolver manifest as source-of-truth:
  - consume `tokens/resolver/msrd.resolver.json` and selected modifier inputs
  - produce deterministic source lists/order for SD builds
  - generate CSS custom properties bundles for `themeSurface` + `size` + `forcedColors`
  - define output namespace/prefix contract for generated vars
  - finalize multi-bundle output structure (`:root`, brand class, dark media query layering)
  - add build scripts/docs for context selection inputs
  - run parity checks against expected light/dark + surface outputs

## Next

What we could start work on next.

- Add `wireframe` brand to validate multi-brand portability:
  - `tokens/src/wireframe/primitive/*`
  - `tokens/src/wireframe/semantic/*` with matching public API shape

- Add validation and CI checks:
  - JSON/schema/spec checks
  - unresolved alias checks
  - circular reference checks
  - generated CSS snapshot/golden checks

- Start a component token layer (`tokens/src/<brand>/components/...`) after pipeline + validation are stable.
  - finalize surface taxonomy contract and whether all components bind to explicit surface context
  - one component initially
  - then more

## Later

Everything we could attempt given sufficient time and resources.

- Prove end-to-end token consumption in a target stylesheet/component slice.
- Evaluate introducing a neutral semantic `layout.dimension` namespace for non-axis sizing aliases (icons, square sizes, etc.).
- Evaluate adding a `layout` axis/context for full-viewport surfaces (`fullScreen` / `canvas`) and composition rules with existing `size` contexts.

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
