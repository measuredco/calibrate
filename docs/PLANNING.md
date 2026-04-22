# Opportunity roadmap

This roadmap is intentionally fluid: items can move freely between `NOW`, `NEXT`, `LATER`, and `DONE` as priorities and discoveries change.

## Now

What we're working on now.

## Next

What we could be working on next.

### Web Components

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

### Framework adapters (e.g. `@measured/calibrate-react`)

Identify the minimum adapter surface needed to consume token/component contracts ergonomically across target frameworks.

## Later

Everything we could attempt given sufficient time and resources.

### Minimal viable publish

Define the minimum scripts, workflow, and release notes needed to publish initial alpha packages and unblock downstream adoption tasks.

### Component evolution

- Add `menuitemcheckbox`/`menuitemradio` support to `Menu`
- Add `data-testid` and/or `id` support
- Add `size: "lg"` to Controls (and `details`, etc.)
- Add `renderPosterImage` to expose subset of `image` props in `poster` API
- Add light `Poster` story
- Add `image` `sources` art direction example to Storybook
- Show `page` sticky header border on scroll only

### Component analytics

Figure out a way to support arbitrary analytics attributes/classes without opening a general escape hatch. Note - Plausible implementation in Facet used classnames.

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

#### Design model evolution

- Custom inverse themes?
- `density` context (class-based in CSS); current size context grid/spacing is broadly editorial/comfortable in nature, this may be fine, but may want to add a ui/compact mode
- Border and Transition DTCG Composites
- Consider introducing Newsreader as a serif font for prose body copy.

#### JSON export target

Define a stable JSON artifact contract for downstream consumers (including docs) so metadata and token data can be consumed without coupling to internal bridge/build intermediates. Likely `packages/tokens` / `@measured/calibrate-tokens`.

Note: pipeline is currently hard-coded to CSS; probably add optional `--formats` in `packages/system/scripts/pipeline/index.mjs` when implementing a second export target.

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

## Done

What we've done.

_This section is a historical completion record; some entries may describe decisions or intermediate states that were later refined._

- Web-component event surface landed as a SPEC `events` field (chose extension over CEM to keep a single docgen source across SSR + class-based components):
  - added `ClbrSpecEvent` and `events?: Record<string, ClbrSpecEvent>` to `ClbrComponentSpec`
  - extended `specToArgTypes` to emit event entries with `action: <name>` under `table.category: "events"` so Storybook Controls renders them in a separate group and the Actions panel logs firings
  - added sibling `specToEventsTable` helper for external docs consumption, matching `specToPropsTable`
  - populated `events` on `CLBR_ALERT_SPEC`, `CLBR_BANNER_SPEC`, `CLBR_MENU_SPEC`; dropped duplicated runtime event entries from `output.composition`
  - `describeSpecConsistency` now validates each event has a non-empty description and uses the `clbr-` name prefix

- Component test audit remediation and SPEC/renderer consistency helper landed:
  - normalized mount convention across all 42 component test files — each local helper mounts into `<div class="clbr">…</div>` and returns the `.clbr` root per `CONSTRAINTS.md`
  - adopted user-first Testing Library queries (`getByRole`/`getByLabelText`/`getByText`) where user-facing roles/labels exist; `querySelector` reserved for SSR structural-contract assertions on primitives
  - migrated interactive-behavior tests (`alert`, `banner`, `nav`, `sidebar`) to `@testing-library/user-event` for keyboard/focus/pointer fidelity
  - added escape/XSS coverage for every renderer that mixes trusted and escaped props
  - flattened describe grouping to `describe("renderClbrFoo", ...)` + `describe("defineClbrFoo", ...)` per public function
  - shipped `describeSpecConsistency<Props>` helper at `packages/core/src/testing/spec.ts` (description presence, defaults match, `ignoredWhen` no-ops, enum round-trip) and wired it into every component's test suite; `src/testing/` excluded from `tsconfig.build.json` so utilities don't ship in `.d.ts`
  - test count grew from 874 → 1152 across 42 files with the consistency helper expanding branch coverage

- Storybook docs fidelity migration completed:
  - promoted `CLBR_*_SPEC` to canonical docs/tooling source of truth; added `specToArgTypes`, `specToComponentDescription`, and `specToPropsTable` helpers that map SPEC props to Storybook argTypes and Markdown tables
  - added top-level `description` and per-prop `description` to every `CLBR_*_SPEC`
  - migrated all `*.stories.ts` to consume SPEC-driven argTypes, with per-story overrides (e.g. Button's `hideControls(...)`, curated `icon` option lists) kept at the story level
  - demoted JSDoc on public component contracts to a functional role (`@param`, `@default`, `@returns`); SPEC carries the human-facing prose
  - added `apps/storybook/tsconfig.json` so `.storybook/**` and story files get proper editor type-checking without leaning on the core package's `tsconfig`
  - added a docs-only Introduction MDX page, sorted first in the sidebar
  - pinned `react-dom` to match `react` in `apps/storybook` to fix empty autodocs pages caused by React error #527 (mismatched react/react-dom versions)

- Brand shape tokens implemented in system:
  - added a `shape` domain to `packages/system` for logo geometry and Measured visual-language shapes
  - canonical shape source now lives in raw brand primitive tokens as `viewBox` + `path`, with semantic shape tokens mirroring those raw inputs
  - the system pipeline derives public CSS-ready outputs as `image`, `aspectRatio`, and `blockSize`
  - public CSS exposes only the derived shape outputs, while primitive/private output remains raw geometry
  - `packages/core/src/components/logo/logo.css` now consumes generated shape vars instead of hardcoded SVG data URIs and aspect ratios

- Shape component implemented as a graphic primitive in core:
  - added `shape` renderer + CSS + stories + tests
  - settled API includes optional `variant` (visual-language shape ids), optional `tone` (`default | neutral | brand | support`), and optional `size` (`xs | sm | md | lg | xl | fill`)
  - component renders a single `div.shape` and relies on generated shape token vars for mask image, canonical block size, and size scaling

- Pattern component implemented as a graphic primitive in core:
  - added `pattern` renderer + CSS + stories + tests
  - settled API includes trusted `children`, optional `variant` (mirroring shape variants), optional `tone` (`default | subtle | support`), and optional `size` (`xs | sm | md | lg | xl | fill`)
  - component renders a single `div.pattern` with a CSS-driven repeated masked layer for decorative exploration behind child content

- Alert implemented as the first JS-enabled web-component in core:
  - added `alert` renderer + CSS + stories + tests

- Menu implemented as a control primitive in core:
  - added `menu` renderer + CSS + stories + tests
  - settled API includes:
    - required `id`
    - required `items`
    - typed `trigger` config composed into `renderClbrButton(...)`
    - optional `align` (`start | end`)
    - optional `size` (`sm | md`)
  - menu composes its owned trigger button and uses button-level `disclosure`, `controls`, and `haspopup` props rather than HTML string post-processing
  - runtime is WC-based and host-scoped:
    - owned trigger and popup
    - `role="menu"` popup labelled by the trigger
    - `role="menuitem"` action items
    - APG 1.2 aligned keyboard handling for trigger/menu items
    - outside click close
    - choose event emitted from the `clbr-menu` host
  - disabled items now follow the APG pattern via `aria-disabled` rather than native `disabled`
  - persistent choice (`menuitemradio` / `menuitemcheckbox`) and submenus remain deferred follow-up work
  - settled API includes optional `dismissible`, optional `dismissibleLabel`, optional `inlineSize` (`full | fit`), required escaped `message`, optional escaped `title`, and optional `tone` (`info | success | warning | error`)
  - SSR output remains meaningful light-DOM HTML inside a `clbr-alert` host, while `defineClbrAlert()` upgrades dismissible alerts in place by injecting a close control and handling removal
  - alert runtime now dispatches `clbr-alert-before-dismiss` (cancelable) and `clbr-alert-dismiss` (bubbling) for consumer hooks
  - established `defineClbrComponents()` as the top-level runtime registration convenience in `core`

- Banner implemented as a lightweight status web-component in core:
  - added `banner` renderer + CSS + stories + tests
  - settled API includes optional inline `action` link, default-true `dismissible`, optional `dismissibleLabel`, required escaped `message`, and optional `tone` (`info | success | warning | error`)
  - SSR output remains meaningful light-DOM HTML inside a `clbr-banner` host, while `defineClbrBanner()` upgrades dismissible banners in place by injecting a close control and handling removal
  - banner runtime now dispatches `clbr-banner-before-dismiss` (cancelable) and `clbr-banner-dismiss` (bubbling) for consumer hooks
  - page shell now includes optional `banner` markup ahead of the header region

- Nav and Expander implemented and stabilized in core:
  - added `expander` renderer + CSS + stories + tests as a reusable control primitive with `controlsId`, `expanded`, `label`, and `size`
  - settled `nav` SSR contract now renders semantic `nav > ul > li > a` markup inside a `clbr-nav` host, with optional `collapsible`, `contentId`, `expanderLabel`, `expanderPosition`, and `size`
  - `defineClbrNav()` now upgrades `clbr-nav` in place, injects the expander when needed, manages `aria-expanded`, closes on `Escape`, closes `belowTablet` nav on breakpoint crossover, and locks page scroll while expanded
  - settled implementation is plain custom elements rather than Lit; the earlier `enhanceClbrNav` transitional runtime path was removed from the public API
  - specs, stories, exports, and tests were aligned to the final host-plus-inner-nav contract

- Range implemented as a control web-component in core:
  - added `range` renderer + CSS + stories + tests
  - settled API includes required `id` and escaped `label`, optional escaped `description`, optional `disabled`, optional `inlineSize` (`full | fit`), optional `size` (`sm | md`), and optional numeric `min`, `max`, `step`, and `value`
  - SSR output renders semantic `label`, `output`, and `input[type="range"]` markup inside a `clbr-range` host, with description wiring via `aria-describedby` when present
  - `defineClbrRange()` upgrades `clbr-range` in place and keeps the `.output` text synchronized with the current input value
  - range was also added to the temporary field stack sandbox story for cross-control visual checks

- Sidebar implemented and stabilized in core:
  - added `sidebar` renderer + CSS + stories + tests
  - settled API includes required `id`, optional trusted `header`, `children`, and `footer`, optional `size` (`sm | md`), optional `triggerLabel`, optional `collapseLabel`, and optional `aboveNotebook` (`persistent | collapsible | overlay`)
  - SSR output renders a `clbr-sidebar` host with owned trigger and backdrop, plus structural inner `div.sidebar > div.header > div.content` and optional `div.footer`
  - `defineClbrSidebar()` upgrades `clbr-sidebar` in place, injects the collapse control, syncs `aria-expanded`, moves focus into the sidebar on open and back to the trigger on close, supports `Escape` and backdrop dismissal, and uses `matchMedia("(min-width: 68em)")` to apply the `aboveNotebook` behavior model
  - settled host state contract is `data-above-notebook`, `data-size`, `data-collapse-label`, `data-open`, and `data-collapsed`, leaving the inner `.sidebar` structural only

- Blockquote component implemented and aligned across core:
  - added `blockquote` renderer + CSS + stories + tests
  - settled API includes required trusted `quote` and `attribution`, optional `align` (`start | center | end`), optional `measured`, optional `responsive`, and optional `size` (`md | lg`)
  - component renders `div.blockquote` with semantic `blockquote` and attribution wrappers, composing `renderClbrText` internally for both quote and attribution
  - `align` defaults to `start` and is emitted on the root only when non-default, while also passing through to the composed quote paragraph; `measured` defaults to `true`; attribution is always rendered at `sm`

- Figure component implemented as an image-with-caption structure primitive:
  - added `figure` renderer + CSS + stories + tests
  - renders semantic `figure`/`figcaption` markup with trusted media content and caption text composed via `renderClbrText`
  - settled first-pass API includes trusted `caption`, trusted `children`, optional `align`, and optional `responsive` for the caption

- Card component implemented and aligned across core:
  - added `card` renderer + CSS + stories + tests
  - settled API includes required escaped `title`, required trusted `description`, optional trusted `note`, optional `href`, optional `headingLevel`, and optional `surface`
  - component renders `div.card` with decorative dots, a title wrapper (`div` by default or semantic heading when `headingLevel` is provided), `p.description`, and optional `p.note`
  - when `href` is provided the title renders as a link, and when both `href` and `note` are provided the note includes a trailing decorative arrow icon
  - related cleanup completed in the same change set:
    - removed system `component` token layer support from resolvers, pipeline prep, and constraints/planning docs
    - removed now-unused MSRD card component token sources after Card was rewired to semantic tokens only

- Panel component implemented as a first-pass structure primitive:
  - added `panel` renderer + CSS + stories + tests
  - settled API includes optional trusted `children`, optional `inlineSize` (`full | fit`), optional `offsetStroke`, optional `padding` (`xs | sm | md | lg | xl`), and optional `surface`
  - panel always uses the panel background, default border, default shadow, and `lg` radius; only the documented variant attributes are configurable
  - `inlineSize` defaults to `full` and emits `data-inline-size="fit"` only when requested; `padding` defaults to `md` and always emits as `data-padding`; `offsetStroke` defaults to `false` and emits `data-offset-stroke` only when true
- Box component contract simplified and aligned across core:
  - removed legacy `shadow` and `offsetStroke` props and simplified `border` to a boolean subtle-border toggle
  - settled API includes optional `background` (`default | panel`), optional boolean `border`, optional trusted `children`, optional `padding` (`xs | sm | md | lg | xl`), optional `radius` (`sm | md`), and optional `surface`
  - `background` defaults to `default` and is omitted when default; `border` defaults to `false` and emits `data-border` as a presence attribute only when true; `radius` is omitted by default

- Badge component implemented and aligned across core:
  - added `badge` renderer + CSS + stories + tests
  - settled API includes escaped plain-text `label`, optional `tone` (`neutral | info | success | warning | error`), optional `size` (`sm | md`), and optional `floating`
  - `tone` defaults to `neutral` and is omitted when default; `size` defaults to `md` and always emits as `data-size`; `floating` defaults to `false` and emits `data-floating` only when true
  - semantic tone styling consumes the new `status.*` color tokens
  - floating badge usage is demonstrated against avatar/button/link compositions in Storybook
- Details component implemented and aligned across core:
  - added `details` renderer + CSS + stories + tests
  - settled API includes required escaped `summary`, optional trusted `children`, optional `open`, and optional `inlineSize` (`full | fit`)
  - component renders native `<details>/<summary>` markup with a decorative shared chevron icon marker and `.content` wrapper
  - `open` emits the native `open` attribute only when true; `inlineSize` defaults to `full` and emits `data-inline-size="fit"` only when requested
  - related width-contract refactor completed across input, textarea, and fieldset: prop renamed to `inlineSize`, values renamed to `full | fit`, and emitted attr renamed to `data-inline-size`
- Spinner component implemented and aligned across core:
  - added `spinner` renderer + CSS + stories + tests
  - settled API includes optional `label`, optional `size` (`2xs | xs | sm | md | lg | xl | 2xl | fill`), and optional `tone` (`default | brand`)
  - spinner renders a `span.spinner` containing an aria-hidden SVG; when `label` is present it also emits `role="status"` and visually hidden escaped label text
  - `size` defaults to `md` and always emits as `data-size`; `tone` defaults to `default` and is omitted when default
  - extended spinner-only `xl` and `2xl` sizes map to vertical spacing tokens rather than the shared icon size scale
- Avatar component implemented and stabilized across core:
  - added `avatar` renderer + CSS + stories + tests, plus exported `getClbrInitials` helper with dedicated matrix tests
  - settled API includes `alt`, `ariaHidden`, `entity`, `color`, `initials`, `name`, `size` (`xs | sm | md | lg | xl`), and `src`
  - settled behavior includes variant precedence (`src` > `initials` > derived initials > icon), deterministic name-hash color assignment with default-neutral omission, and strict explicit initials validation (alphabetic-only, max 3)
  - settled icon fallback mapping includes `organization -> building-2`, with icon child rendered as decorative `size="fill"`
  - spec/contracts, exports, and Storybook controls aligned with final omit/emit/default rules
- Logo component implemented and aligned across core:
  - added `logo` renderer + CSS + stories + tests
  - API includes required accessible `label`, optional `variant` (`primary | secondary | typographic | graphic`), optional `tone` (`default | neutral`), and optional `size` (`sm | md | lg | fill`)
  - renderer emits `div.logo` with always-emitted `data-size`, and default-omitted `data-variant`/`data-tone`
  - variant masks implemented from canonical mask SVG assets with per-variant aspect ratios
  - tone maps to semantic logo color tokens
  - exports and core styles entrypoint wiring added
- Image component implemented and stabilized across core:
  - added `renderClbrImage` with settled prop contract (`src`, `alt`, `cover`, `aspectRatio`, `objectPosition`, `width`, `height`, `sources`, `srcSet`, `sizes`, `lazy`, `priority`, `radius`, `shadow`)
  - finalized emit behavior for `cover`/`aspectRatio`/dimensions (including aspect-ratio suppression when both dimensions are provided)
  - added picture/source rendering path with normalized source attributes and fallback img behavior
  - completed Storybook examples for responsive `srcSet`/`sizes` and art-direction source switching
  - rewrote image test suite from scratch against settled API/behavior to remove change-trace residue
  - updated `CLBR_IMAGE_SPEC`, exports, and core styles integration

- Fieldset extraction and radios composition refactor completed:
  - added dedicated `fieldset` component (renderer/CSS/stories/tests/spec)
  - radios now composes `renderClbrFieldset` and keeps orientation on `.radios`
  - fieldset now supports width contract aligned with input (`full | auto`, emit only for `auto`)
  - radios/fieldset specs and tests were rewritten against the settled APIs to remove change-trace residue
- Switch component implemented and aligned across core:
  - added `switch` renderer + CSS + stories + tests
  - API includes `label` (required), optional `checked`, `disabled`, `description`, `descriptionId`, `name`, `size`, and `value`
  - implemented with native `input[type="checkbox"]` + `role="switch"` semantics
  - `descriptionId` contract mirrors checkbox behavior (required when `description` is provided)
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Wireframe (`wrfr`) theme visual design pass completed:
  - expanded wrfr primitive/semantic color and typography tokens (light/dark + brand)
  - added brand-specific typography/prose behaviors (including link decoration state model and code padding tokens)
  - updated core prose/text CSS to consume the revised typography token structure
  - refreshed wrfr brand font assets and root font baseline usage
  - rebuilt token artifacts and verified system build output
- Textarea component implemented and aligned across core:
  - added `textarea` renderer + CSS + stories + tests
  - API includes `id`/`label` (required), optional `description`, `size`, `width`, `autocomplete`, `name`, `value`, `disabled`, `readOnly`, `required`, `spellcheck`, `invalid`, `resize`, and `rows`
  - `resize` defaults to `vertical` and omits default attribute emission
  - `rows` defaults to `2` with runtime minimum `2`
  - spellcheck preserves browser defaults when omitted
  - spec, exports, and core styles entrypoint wiring added
- Divider component implemented and aligned across core/system:
  - added `divider` renderer + CSS + stories + tests
  - API settled on `orientation` (`horizontal | vertical`) and `tone` (`default | subtle | brand`)
  - horizontal renders semantic `<hr>`; vertical renders `<span role="separator" aria-orientation="vertical">`
  - tone defaults to `default` (omitted in markup); non-default tones emit `data-tone`
  - added brand layout semantic tokens for divider sizing/thickness in `msrd` and `wrfr`
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Cross-library prop contract consistency audit completed:
  - reviewed optional/required props, runtime defaults, and omit/emit behavior across component renderers
  - established default emission policy in constraints for semantic/context defaults vs deterministic layout attrs
  - fixed Box SPEC wording drift for `border` emit rule (`subtle | brand`)
- Button icon props implemented and aligned across core:
  - button API expanded with `icon`, `iconPlacement`, `iconOnlyBelow`, `iconMirrored`
  - button renderer composes `renderClbrIcon` (decorative icon path, shared icon validation/render behavior)
  - responsive collapse behavior implemented for `iconOnlyBelow="tablet"` with visually-hidden label at narrow widths
  - button spec updated with icon props, omission rules, and content ordering rules
  - Storybook button stories updated for icon controls in button/link modes
  - button tests expanded for icon rendering, ordering, collapse/mirroring, omission handling, and link-mode parity
  - icon sizing moved to core layout tokens (`2xs`..`lg` + `default`) and wired into icon/button CSS
- Heading component implemented and aligned across core/system:
  - added `heading` renderer + CSS + stories + tests
  - API includes `children`, optional `level`, `size`, `align`, and `responsive`
  - emits semantic heading elements (`h1`..`h6`) when `level` is set, otherwise renders `span`
  - fixed heading typography moved to root semantic tokens (`typography.text.heading.*`)
  - responsive heading typography exposed via contextual tokens (`typography.text.heading.responsive.*`)
  - heading CSS supports fixed/default typography and opt-in responsive typography via `data-responsive`
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Radios component implemented and aligned across core:
  - added `radios` renderer + CSS + stories + tests
  - API settled on `legend`, `radios[]`, `id`, `name`, optional `description`, `value`, `required`, `disabled`, `invalid`, and `orientation`
  - group description is wired on `fieldset[aria-describedby]`, per-item descriptions are wired per input and rendered outside each label
  - group invalid is emitted on `fieldset` only; group disabled uses `fieldset[disabled]` inheritance, with per-item disabled emitted on individual radios
  - required is emitted on all non-disabled radios when enabled
  - spec and exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Text component implemented and aligned across core/system:
  - added `text` renderer + CSS + stories + tests with `span` (default) and `p` modes
  - added body typography `xs` and responsive body scale tokens (`baseline`/`tablet`) and wired them into Text sizes
  - added prose link controls (`linkVisited`) and inline code styling
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Input component implemented and aligned across core/system:
  - added `input` renderer + CSS + stories + tests
  - API includes `id`/`label` (required), optional `description`, `size`, `width`, `type`, `autocomplete`, `pattern`, `name`, `value`, `disabled`, `readOnly`, `required`, `spellcheck`, and `invalid`
  - `numeric` type maps to `type="text"` with `inputmode="numeric"` and default numeric `pattern` (overridable)
  - single `description` slot is reused for hint or validation guidance; invalid state remains app-controlled
  - invalid precedence aligned with input editability (`disabled`/`readOnly` suppress `aria-invalid`)
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Prose component implemented and aligned across core:
  - added `prose` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `align`, `measured`, `responsive`, and `hangingIndent` (`always | notebook`)
  - renders `<div class="clbr-prose">` and follows text-style data-attribute omission defaults
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Container component implemented and aligned across core/system:
  - added `container` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `maxWidth` (`default | wide | none`), and optional `gutter` (`default | narrow | none`)
  - default values omit `data-*`; non-default values emit explicit attributes for deterministic styling
  - semantic layout tokens updated to `container.gutter.{default|narrow}` and wired through system build output
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Grid component implemented and aligned across core/system:
  - added `grid` and `grid-item` renderers + CSS + stories + tests
  - API includes trusted-HTML `children`, gap variants (`default | expanded | none`), and item placement props across `narrow` / `default` / `wide` thresholds
  - renderer outputs `.grid-container` wrapper with inner `.grid`; item props emit data attributes for column/row span/start placement
  - layout grid gap semantics refactored to root tokens (`layout.grid.gap.sm|md|lg`) and wired into CSS via container/media thresholds
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Stack component implemented and aligned across core/system:
  - added `stack` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `gap` (`xs | sm | md | lg`), optional `align` (`start | center | end | stretch`), and optional `responsive`
  - renderer emits `data-gap` always, emits `data-align` when provided, and emits `data-responsive` only when true
  - CSS maps static stack gap to spacing tokens and responsive mode to layout spacing tokens
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Inline component implemented and aligned across core/system:
  - added `inline` renderer + CSS + stories + tests
  - API includes trusted-HTML `children`, optional `gap` (`2xs | xs | sm | md | lg`), optional `align` (`start | center | end`), optional `justify` (`start | center | end | between`), and optional `nowrap`
  - renderer emits `data-gap` always, emits non-default `data-align`/`data-justify`, and emits `data-nowrap` only when true
  - CSS maps horizontal gap scale to spacing tokens and supports cross-axis align plus main-axis justify variants
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Checkbox component implemented and aligned across core/system:
  - added `checkbox` renderer + CSS + stories + tests
  - API includes `label` (required), optional `checked`, `disabled`, `invalid`, `required`, `name`, `value`, `description`, and `descriptionId`
  - description wiring enforces non-empty valid `descriptionId` when `description` is provided and maps via `aria-describedby`
  - invalid state support added with disabled precedence (`disabled` suppresses `aria-invalid`)
  - renderer/spec/tests aligned for normalization and escaping behavior
  - added Storybook-only `Indeterminate` scenario (via `play` state) for styling `:indeterminate` without changing SSR contract
  - exports wired through `@measured/calibrate-core` index and core styles entrypoint
- Button component review/refinement completed:
  - mode-explicit API (`mode: "button" | "link"`) with clear per-mode prop contracts
  - renderer/spec/docs/story/tests aligned around omission/normalization rules
  - tests rewritten around stable contract (button mode, link mode, robustness, escaping)
- Surface component baseline completed:
  - added `surface` renderer + CSS + tests + stories
  - integrated `surface` global toolbar control in Storybook preview
  - added story-level `withSurface` parameter support for wrapper control
- Initial `packages/core` baseline completed:
  - SSR-first renderer architecture established with `root` and `button` primitives
  - package-level TypeScript/testing/Storybook/quality gates in place
  - stable component-package constraints moved to `docs/CONSTRAINTS.md`
- Phase complete: Semantic API baseline (core + brand semantic coverage, responsive semantics included).
- semantic color theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic color theme files include `base16` groups (`00`..`0F`) with hex descriptions.
- semantic effect theme/surface files for `msrd` (`light|dark` × `default|brand`).
- semantic effect files now expose `opacity.demoted` mapped from `primitive.effect.opacity.40`.
- semantic folder structure is axis-first for color/effect, with typography and layout using `size` contexts.
- semantic spacing now exposes root non-size scales (`vertical`, `horizontal`) in `packages/system/src/base/semantic/spacing.tokens.json`.
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
- brand radius ratio primitives introduced (migrated from earlier shape-domain corner-ratio modeling) with semantic exposure.
- external typography size `$ref` paths corrected to current folder structure.
- source token tree moved under `packages/system/src` (core + brand).
- spec-shaped resolver manifest added at `packages/system/resolver/msrd.resolver.json` with `resolutionOrder`.
- DTCG schemas vendored under `packages/system/schemas/2025.10` and local `$schema` paths applied across authored token/resolver files.
- Style Dictionary bridge/pipeline implemented:
  - `packages/system/scripts/pipeline/resolve-token-sources.mjs` resolves resolver context source ordering
  - `packages/system/scripts/pipeline/prepare-sd-sources.mjs` merges/normalizes token sources for SD consumption
  - `packages/system/scripts/pipeline/prepare-sd-contexts.mjs` emits context token doc + CSS manifest
  - `packages/system/style-dictionary.config.mjs` formats CSS from generated context + manifest inputs
- Resolver->SD boundary refactor completed (bridge outputs SD-ready with minimal SD-config shaping):
  - formatter path-index assumptions removed in favor of bridge metadata (`dev.msrd.calibrate.bridge`)
  - public/private split now handled by SD role filters
  - single SD run per target for public+private outputs
  - docs and constraints updated to reflect current bridge contract and temporary SD `$dimension` compatibility shim
- Output contracts established:
  - committed/public outputs in `packages/system/dist/{css,json}`
  - disposable pipeline artifacts in `packages/system/build/{sd,tmp}`
- Resolver->SD bridge API and docs stabilized:
  - adapter keys documented (`baseContext`, `deltaFromContext`, selector refs, variant defaults)
  - naming and authoring conventions documented for future brands/modifiers
- Artifact policy decided and enforced:
  - `packages/system/dist/**` is versioned/public
  - `packages/system/build/**` is disposable
  - `system:verify` added to fail when `packages/system/dist/**` is out of date after build
- Multi-brand packaging/layering base implemented:
  - `base` and `msrd` outputs now build independently
  - base artifacts: `packages/system/dist/css/clbr.base.tokens.css`, `packages/system/build/sd/clbr.base.contexts.json`
  - msrd artifacts: `packages/system/dist/css/clbr.msrd.tokens.css`, `packages/system/build/sd/clbr.msrd.contexts.json`
  - deterministic CSS layering emitted via `@layer clbr, clbr.brand;`
- Wireframe brand onboarding completed:
  - resolver added: `packages/system/resolver/wrfr.resolver.json`
  - brand source added under `packages/system/src/wrfr/{primitive,semantic}`
  - build target wired in `packages/system/scripts/pipeline/index.mjs`
  - brand artifacts emit and verify:
    - `packages/system/dist/css/clbr.wrfr.tokens.css`
    - `packages/system/build/sd/clbr.wrfr.contexts.json`
- Consumer include/override strategy documented in constraints:
  - load contract for `core` + brand bundles
  - scoped multi-brand usage on one page
  - class contracts for brand/theme/surface selectors
- Baseline validation + CI checks implemented:
  - `system:validate` added for authored token/resolver JSON checks and resolver-context preparation checks
  - CI workflow added at `.github/workflows/tokens.yml`
  - CI runs:
    - `pnpm run system:validate`
    - `pnpm run system:verify`
- Optional private primitive output implemented for maintainer/discovery workflows:
  - output path: `packages/system/dist/private/css/`
  - file naming: `clbr.<brand>.primitives.css`
  - variable guard prefix: `--clbr-primitive-*`
  - documented as non-public/non-stable contract (semantic remains the public API)
- Authoring ergonomics for context declarations improved:
  - sparse/override-only context files are supported as first-class authoring for cumulative axes
  - `theme` source composition now uses cumulative `baseContext` inheritance (aligned with `size`)
  - constraints now document when duplicate declarations should be retained (alias-anchor/readability cases)
- Resolver bridge docs now co-locate with bridge code:
  - canonical bridge doc lives at `packages/system/scripts/README.md`
- Bridge scripts now use a dedicated subfolder structure:
  - pipeline scripts moved to `packages/system/scripts/pipeline/*`
  - build entrypoint is `packages/system/scripts/pipeline/index.mjs`
- Vendored DTCG spec reference docs relocated under `packages/system/schemas/2025.10/spec`.
- ESLint and Prettier baseline tooling added:
  - `eslint` configured via `eslint.config.mjs` for token pipeline scripts
  - `prettier` configured via `.prettierrc.json` and `.prettierignore`
  - scripts added in `package.json`: `lint`, `lint:fix`, `format`, `format:check`
- `wrfr` remains in-tree as a multi-brand packaging and runtime scoping probe
- Monorepo architecture baseline completed (pnpm workspace, lockstep versioning):
  - `pnpm-workspace.yaml` added with `packages/*`
  - tokens package moved to `packages/system` with package-local build/validate/verify scripts
  - root scripts now delegate via workspace filters (`@measured/calibrate-system`)
  - `packages/core` scaffold added as the next package boundary
- Monorepo package boundary realignment completed:
  - `packages/components` -> `packages/core` (`@measured/calibrate-core`)
  - `packages/tokens` -> `packages/system` (`@measured/calibrate-system`, kept private)
  - `@measured/calibrate-core` positioned as the primary runtime consumption contract
  - `@measured/calibrate-core/styles.css` established as the single CSS entrypoint (composing token + component CSS)
  - cross-package deps/scripts/CI/docs updated to new names and boundaries
  - publish intent clarified: `@measured/calibrate-core` and `@measured/calibrate-config` publishable, `@measured/calibrate-system` internal
- Storybook runtime extracted to app boundary:
  - moved Storybook config/runtime from `packages/core/.storybook` to `apps/storybook/.storybook`
  - preserved story co-location in package source (`packages/*/src/**/*.stories.ts`)
  - script ownership moved to `apps/storybook`, with root convenience aliases (`storybook`, `storybook:build`)
  - static output normalized to `apps/storybook/storybook-static`
  - CI expanded with dedicated Storybook build job
- Class/attribute grammar applied to root + surface contracts:
  - structural semantics use classes; state/variant semantics use attributes
  - `root` now emits `.clbr` + `data-brand` (+ optional `data-theme`)
  - `surface` now emits `.surface` + `data-surface` (default included)
  - token resolver selectors and generated brand CSS updated to match attribute grammar
- Surface selector contract refactor completed:
  - brand surface token scopes now target `[data-surface="brand"]` (not `.surface[data-variant="brand"]`)
  - no compatibility selectors are emitted (intentional breaking change)
  - enables reuse of surface context attributes on non-Surface wrappers (e.g. future `Box`)
- Font distribution contract implemented:
  - `@measured/calibrate-assets` package added for runtime font assets
  - vendored variable Inter + Roboto Mono font files and `@font-face` entrypoint at `@measured/calibrate-assets/fonts.css`
  - Storybook now imports package fonts entrypoint and validates packaged font loading
  - `core` docs updated to define font load order (`assets/fonts.css` before `core/styles.css`)
- Storybook accessibility CI gate implemented:
  - Storybook addon-a11y retained for local interactive checks
  - Storybook Vitest addon wired for automated accessibility testing (WCAG 2.2 AA, no exclusions)
  - Storybook CI job now executes Storybook a11y tests as a dedicated gate
  - local reproducible scripts added for a11y runs
