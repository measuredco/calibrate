---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Every component now accepts an `id` prop, placed on the appropriate host: outermost wrapper for structural components, the interactive element for Link, the inner input for form controls. Consumers own id generation — nothing is auto-generated.

**Breaking changes** (alpha — bumped as minor per the existing posture):

- Checkbox and Switch drop `descriptionId`. When `description` is set, `id` is required; the description element's id is derived as `${id}-description`.
- Icon drops `titleId`. When `ariaHidden` is false, `id` is required; the title element's id is derived as `${id}-title`.
- Sidebar's `id` now goes on the host. The inner panel is `${id}-panel` (and the trigger's `aria-controls` references it).
- Menu's `id` now also goes on the host (it was previously a seed only for the trigger and popup ids).

Migration: rename `descriptionId` / `titleId` to `id` on the affected components. Update any external selectors targeting Sidebar's panel from `#my-sidebar` to `#my-sidebar-panel`.
