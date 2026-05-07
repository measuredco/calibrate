# @measured/calibrate-react

## 0.2.0

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

- 6198a8f: Poster: rename `image` → `media` and constrain it to a branded type produced by `renderClbrPosterImage`. The helper locks `cover` and `priority` to the values Poster's layout depends on and exposes only the props that can vary (`gravity`, `sizes`, `src`, `srcSet`). The image is decorative — Poster is a content-over-background layout — so `alt` is always empty.

  Migration:

  ```ts
  // before
  renderClbrPoster({
    image: renderClbrImage({
      cover: true,
      priority: true,
      src,
      srcSet,
      sizes,
      gravity,
    }),
  });

  // after
  renderClbrPoster({
    media: renderClbrPosterImage({ src, srcSet, sizes, gravity }),
  });
  ```

  The React adapter follows the rename: `<Poster media={...}>` (was `image`).

- 59c906d: Every component now accepts an `id` prop, placed on the appropriate host: outermost wrapper for structural components, the interactive element for Link, the inner input for form controls. Consumers own id generation — nothing is auto-generated.

  **Breaking changes** (alpha — bumped as minor per the existing posture):
  - Checkbox and Switch drop `descriptionId`. When `description` is set, `id` is required; the description element's id is derived as `${id}-description`.
  - Icon drops `titleId`. When `ariaHidden` is false, `id` is required; the title element's id is derived as `${id}-title`.
  - Sidebar's `id` now goes on the host. The inner panel is `${id}-panel` (and the trigger's `aria-controls` references it).
  - Menu's `id` now also goes on the host (it was previously a seed only for the trigger and popup ids).

  Migration: rename `descriptionId` / `titleId` to `id` on the affected components. Update any external selectors targeting Sidebar's panel from `#my-sidebar` to `#my-sidebar-panel`.

### Patch Changes

- 7cd1b40: Form controls now play cleanly with React's controlled-input checks:
  - Event handlers and `autoFocus` route to the inner `<input>` / `<textarea>` / `<select>` instead of the host wrapper, so React sees them on the element it checks. `ref` continues to land on the host wrapper.
  - HTML boolean props (`checked`, `disabled`, `required`, `readonly`, etc.) preserve their `false` value through the React adapter, so toggling a checkbox / switch keeps the input controlled. `false` on `data-*` and `aria-*` is still omitted (matches SSR).
  - `Input` preserves the empty string distinctly from `undefined`, so clearing a controlled field doesn't flip it from controlled to uncontrolled.

- b00bb58: Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.
- Updated dependencies [ef1672a]
- Updated dependencies [2e46597]
- Updated dependencies [9a25190]
- Updated dependencies [93ce56b]
- Updated dependencies [134b977]
- Updated dependencies [96c75ce]
- Updated dependencies [6198a8f]
- Updated dependencies [7cd1b40]
- Updated dependencies [b00bb58]
- Updated dependencies [ec27a3a]
- Updated dependencies [53caec4]
- Updated dependencies [59c906d]
- Updated dependencies [31ecaa2]
  - @measured/calibrate-core@0.2.0

## 0.2.0-alpha.6

### Patch Changes

- Updated dependencies [ef1672a]
  - @measured/calibrate-core@0.2.0-alpha.6

## 0.2.0-alpha.5

### Patch Changes

- Updated dependencies [2e46597]
  - @measured/calibrate-core@0.2.0-alpha.5

## 0.2.0-alpha.4

### Patch Changes

- @measured/calibrate-core@0.2.0-alpha.4

## 0.2.0-alpha.3

### Minor Changes

- 9a25190: Rename two `Heading` props for clarity:
  - `children` → `text`
  - `opticalInline` → `opticalAlign`

  Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.

### Patch Changes

- Updated dependencies [9a25190]
- Updated dependencies [ec27a3a]
- Updated dependencies [53caec4]
  - @measured/calibrate-core@0.2.0-alpha.3

## 0.2.0-alpha.2

### Patch Changes

- @measured/calibrate-core@0.2.0-alpha.2

## 0.1.1-alpha.1

### Patch Changes

- Updated dependencies [31ecaa2]
  - @measured/calibrate-core@0.1.1-alpha.1

## 0.1.1-alpha.0

### Patch Changes

- Updated dependencies [93ce56b]
  - @measured/calibrate-core@0.1.1-alpha.0
