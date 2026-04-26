# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, and `LATER` as priorities and discoveries change.

## Now

What we're working on now.

### Minimal viable publish

**Phase 2 of the commit & release rollout** — flip on actual npm publishing. The Phase 1 plumbing is in place: the workflow already produces Version Packages PRs and merging them advances versions on `main`; this work just turns those merges into npm pushes.

Goal of this publish is end-to-end process validation and colleague tire-kicking — not a polished consumer-facing launch.

Tasks:

- **npm scope ownership** — verify the `@measured` scope on npm and add the publishing identity as a member with publish rights
- **Trusted Publishing setup** — npm supports token-free OIDC publishing from GitHub Actions: workflow + ref are verified by npm at publish time, eliminating long-lived bearer secrets in steady state. Configure via `npm trust github <package> --file release.yml --repo measuredco/calibrate` for each package, or via the npmjs.com web UI on each package's settings page. One-time setup per package.
- **Bootstrap dance for first-time packages** — npm explicitly requires a package to exist on the registry before `npm trust github` can configure trust ([docs](https://docs.npmjs.com/cli/v11/commands/npm-trust)). Since all 4 packages are unpublished today, the first publish must use a temporary npm automation token:
  1. Generate npm automation token (`@measured` scope), add as `NPM_TOKEN` repo secret
  2. Land workflow with temporary `NPM_TOKEN: ${{ secrets.NPM_TOKEN }}` env in the publish step (clearly commented as temp)
  3. Cut first publish (smoke release; prerelease alpha)
  4. Run `npm trust github` for each of the 4 now-published packages
  5. Open follow-up PR removing the temp `NPM_TOKEN` env line; delete `NPM_TOKEN` repo secret
  6. All subsequent publishes via OIDC + provenance only
- **Job-scoped workflow permissions** — move `contents: write`, `pull-requests: write` from workflow level to the `release:` job specifically, and add `id-token: write` (also job-scoped) for OIDC. Both Trusted Publishing and provenance attestation use the same `id-token: write` permission.
- **Runtime versions** — Trusted Publishing requires npm ≥ 11.5.1 and Node ≥ 22.14.0; `npm trust github` needs npm ≥ 11.10.0. Pin via `setup-node` + `npm install -g npm@^11.10.0` in the publish job; GitHub-hosted runners only (provenance attestation requires this). Project's existing `engines: { node: 24.14.0 }` already clears the Node floor.
- **Provenance** — publish with `--provenance` so consumers can verify packages were built from this repo via GitHub Actions.
- **Optional: protected GitHub environment** (e.g. `npm-publish`) with required reviewer for the publish step. Adds a manual gate before any package leaves CI; useful insurance even for solo dev.
- **Workflow `publish:` script** — wire `pnpm changeset publish` (or equivalent) into the `changesets/action` invocation, ending the Phase 1 no-op behavior. Trigger remains restricted to `push: main`.
- **Confirm `"access": "public"`** is honored in `.changeset/config.json` so scoped packages don't default to restricted (already set; verify before first publish).
- **Smoke release** — first publish as a prerelease via changesets `pre` mode (`0.1.0-alpha.0` to the `next` dist-tag), verify packages appear on npm and provenance attestation resolves, then exit `pre` mode and cut `0.1.0` to `latest`. Avoids committing to a stable version on the very first publish.
- **Decide VP PR CI re-trigger approach** — when `changesets/action` opens or updates the Version Packages PR using the default `GITHUB_TOKEN`, GitHub's infinite-loop prevention suppresses workflow triggers on that PR. Required status checks then sit at "Expected — Waiting for status to be reported" forever. Three options:
  1. **Manual close+reopen** of each VP PR before merging (`gh pr close <n> && gh pr reopen <n>`). Zero setup cost; small ritual every release.
  2. **PAT** scoped for `pull-requests: write` + `contents: write`, passed to `changesets/action` instead of `GITHUB_TOKEN`. Re-introduces a long-lived secret in repo (the thing we eliminated for publish auth).
  3. **GitHub App** with the same permissions, mint installation tokens at workflow time. Cleaner identity, shorter-lived tokens, but more setup; minting typically uses third-party action which we've avoided.
     Pick before declaring Phase 2 done. Solo / low-cadence justifies (1).
- **Light release notes** — minimal install + "this is alpha, please kick tires" messaging in the README. Polished launch comms come later.

## Next

What we could be working on next.

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

- Custom inverse themes?
- `density` context (class-based in CSS); current size context grid/spacing is broadly editorial/comfortable in nature, this may be fine, but may want to add a ui/compact mode
- Border and Transition DTCG Composites
- Consider introducing Newsreader as a serif font for prose body copy.

#### Export target evolution

1. Penpot
1. Figma
1. VS Code token lookup artifact
1. iOS
1. Android

### Deterministic sorting (linting)

- JS import/export ordering via ESLint autofix
- JSON key-order enforcement for selected token paths (including top-key conventions like `$schema` / `$type` / `$description` / `default`)
- Alphabetical sorting

### Shared config package evolution

Expand `@measured/calibrate-config` beyond the current browserslist/esbuild baseline to include additional consumer-installable subpath presets (for example ESLint, Stylelint, axe; token-name lint rules, raw hex/px guards), plus optional starter assets for contribution workflows (for example PR template/checklist files).

### Assets package evolution

Expand `@measured/calibrate-assets` beyond v1 fonts scope (for example favicons/images) and define stable vs implementation-detail asset APIs.

### Documentation website (`apps/documentation`)

Stand up a docs site that consumes published token/component packages and serves as the canonical reference for usage, contracts, and examples. Deploy to `http://calibrate.msrd.dev`, `apps/storybook` can deploy to `http://calibrate.msrd.dev/storybook/`

### Skills package (`@measured/calibrate-skills`)

Agent skills markdown.

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
