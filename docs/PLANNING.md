# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

- Create the resolver model. Decisions:
  - authored vs resolved reference-path strategy (including final local-only vs global namespaced authored semantic reference strategy)
  - whether responsive/theme logic remains in semantic authoring vs dedicated resolver docs
  - load/composition order contract
  - output namespace contract (`primitive.*` / `semantic.*`)

## Next

What we could start work on next.

- Style Dictionary 4 MVP pipeline:
  - one brand (`msrd`)
  - CSS custom properties output
  - theme, surface + size context wiring

- Add `wireframe` brand to validate multi-brand portability:
  - `tokens/wireframe/primitive/*`
  - `tokens/wireframe/semantic/*` with matching public API shape

- Add validation and CI checks:
  - JSON/schema/spec checks
  - unresolved alias checks
  - circular reference checks
  - generated CSS snapshot/golden checks

- Start a component token layer (`tokens/<brand>/components/...`) after pipeline + validation are stable.
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
- semantic spacing now exposes root non-size scales (`vertical`, `horizontal`) in `tokens/core/semantic/spacing.tokens.json`.
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
