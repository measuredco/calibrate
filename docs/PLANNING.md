# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Skills package (`@measured/calibrate-skills`)

Markdown guardrails for AI coding agents (and humans) building sites and apps with Calibrate. Audience is consumers of `@measured/calibrate-{core,assets,config,tokens}`, plus `@measured/calibrate-react` for React consumers. Maintainer-facing skills (working in this repo) are a separate, deferred concern.

**Two operational guardrails, canonical → fallback:**

1. **Compose first.** Use Calibrate components, especially layout primitives (Page, Container, Stack, Inline, Box, Grid), before authoring CSS. Playground app and the Page Storybook stories are the canonical worked examples — entire pages built with no custom CSS.
2. **Custom with tokens.** When composition can't meet the requirement, build custom markup and reference design tokens. Stylelint token enforcement (deferred entry under Later) backs this.

The system is largely self-guiding by construction at both layers — components encode design choices in their props, and tokens encode semantic intent in their `$description` fields. Picking the right component or token IS expressing the design language. The few residual mechanical concerns (logical properties, rem, naming) are caught by linting.

A complementary **design-language skill** ships alongside the operational skills, covering the conceptual layer they don't (compositional principle, tokens-as-contract, brand/system/component layering, opinion stack). Operational skills tell agents what to do; the design-language skill tells them why the system is shaped that way, for judgment calls beyond the explicit guardrails.

**Decisions:**

- **Format.** Folder-per-skill with a `SKILL.md` containing minimal frontmatter (`name` + `description`) plus optional sibling folders (`examples/`, `references/`, `assets/`). Claude Code and OpenAI Codex have converged on this shape, so authoring vendor-neutral skills works in both — vendor-specific UI metadata can layer on top later if useful.
- **Distribution.** Published as `@measured/calibrate-skills` with README copy-to-folder instructions (mirroring how `@measured/calibrate-config/editor/clbr.intellisense.css` is consumed today). Different agents read from different discovery directories — Claude Code's `.claude/skills/`, Codex's `.agents/skills/` — so consumers symlink or copy whichever they use. A bootstrap CLI to automate this can hook in later under the existing CLI bootstrap roadmap entry.
- **Hand-authored vs derived.** Author skill narrative by hand. For reference data already documented elsewhere, link to or quote what's reachable to consumers: tokens JSON ships in `@measured/calibrate-tokens` (agents can read it at runtime), the SPEC ships as values from `@measured/calibrate-core`, the Storybook is on a deployed URL. The playground is repo-internal — worked compositional examples in skill `examples/` folders are hand-authored, drawing on the patterns demonstrated there. Don't build per-component auto-generated skills — that's what Storybook reference docs are for; skills carry the curated narrative across components. Revisit extraction tooling only if drift between skill snippets and source becomes a real problem.
- **Core vs React flavor.** Cross-cutting skills (principle-led, e.g. "Compose first") share a single `SKILL.md` and split their `examples/` folder into `core/` and `react/` subfolders. The skill body narrates the principle without committing to a flavor and points consumers at the relevant subfolder. Discovery stays clean (one entry, not two near-duplicates) and the principle stays in one place; the CLI bootstrap can prune to the chosen flavor on install. Skills that are intrinsically flavor-specific (e.g. a future "React form-binding patterns") get their own skill named accordingly — the shared/split call is per-skill.
- **Design-language skill.** Ships in the same `@measured/calibrate-skills` package as a reference-style skill — same `SKILL.md` folder shape as operational skills (so it's auto-discovered by Claude Code / Codex), but with descriptive content (frontmatter description signals "read for context"). Distinct from operational skills like "Compose first" that tell agents what to do.

**First steps:**

1. Scaffold `packages/skills` (package.json, README, file layout).
2. Author the "Compose first" skill end-to-end to lock conventions. Reference the playground patterns as worked examples.
3. Author the design-language skill alongside, covering the conceptual layer (compositional principle, tokens-as-contract, brand/system/component layering).
4. Author "Custom with tokens" once stylelint enforcement lands.

## Next

What we could be working on next.

### Update Lucide to 1.0

## Later

Everything we could attempt given sufficient time and resources.

### Stylelint token enforcement

Adopt "must reference Calibrate token" rules via [`stylelint-declaration-strict-value`](https://github.com/AndyOGo/stylelint-declaration-strict-value), or a fully custom config in the style of [`@primer/stylelint-config`](https://github.com/primer/stylelint-config).

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev` (`apps/storybook` deploys to `http://calibrate-storybook.msrd.dev/`, could reverse proxy to `/storybook`)

### CLI bootstrap tool (`@measured/calibrate`)

Scope a `calibrate` bootstrap CLI for fast project scaffolding with sensible defaults for tokens, components, and optional assets. Allow brand selection and support tree-shaking.

### Component evolution

#### Size gaps

- Missing lg: Alert, Badge, Checkbox, Input, Menu, Nav, Radios, Range, Textarea, Sidebar
- Missing sm: Blockquote
- No size prop: Card, Details, Fieldset, Prose
- Button & Link with size lg are the same as size md if 1. appearance text and label visible or 2. appearance outline or solid, and label hidden.

#### Features

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
