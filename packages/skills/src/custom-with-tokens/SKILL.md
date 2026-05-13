---
name: custom-with-tokens
description: When the system has a gap — a missing component, variant, or pattern — fill it using Calibrate's existing components for everything that fits, and tokens for any residual CSS values. Read this when compose-first has run out and you're about to author custom markup.
---

# Custom with tokens

The fastest path through a gap is _with_ the system, not around it.

## When this applies

You've worked through the compose-first decision flow and one of two things is true:

- the system genuinely doesn't cover the case (e.g. a Stepper — see the worked example below)
- the case wants a visual treatment outside any existing component's prop surface

If you haven't checked compose-first first, do that. Many "I need custom markup/CSS" intuitions evaporate once you find the right component.

## The layered model

When you fill a gap:

1. **Reuse existing components.** Inside your custom markup, reach for Calibrate components wherever they apply — Icon, Button, Heading, Text, Link, Divider, Image, etc. Many leaves you'd reach for in plain HTML have a Calibrate equivalent that handles a11y, sizing, and brand defaults for free. Check the References below for components you may not know about.
2. **Write custom markup + CSS** for the parts no component covers — the structure, the wiring, the bespoke piece.
3. **Reference tokens for design values.** Colors, spacing, dimensions, typography, motion, shadows, opacity, etc. — reach for `var(--clbr-*)` whenever the system has a token. Tokens resolve under theme (light / dark), brand, and surface context automatically; responsive variants (typography, layout spacing) carry breakpoint scale baked in. Raw values lose all of that. See the References below for the catalog.

The order matters. Tokens won't backfill what a component would have given you (a11y, sizing, brand defaults). Reach for the component first; only diverge when the design genuinely needs something outside its prop surface.

## Picking the right token

The published token catalog ships at `@measured/calibrate-config/clbr.catalog.css` — a `:root` block listing every `--clbr-*` token with its resolved value and `$description`. The same data ships as DTCG JSON via `@measured/calibrate-tokens/{msrd,base}` if your tooling wants tokens as data.

Tokens are organised by category prefix (e.g. `--clbr-color-*`, `--clbr-spacing-*`, `--clbr-radius-*`). The category narrows the search; the `$description` on each token confirms semantic intent — read it before reaching for a token whose name sounds right.

If the right token feels missing for your case, that may signal a system gap worth surfacing as an issue rather than an opportunity to reach for a literal value.

## Accessibility

All UI built with Calibrate must meet [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) — the same bar the system holds itself to internally. A few points specific to Calibrate worth highlighting:

- **Color contrast follows from tokens.** Calibrate's color tokens are tuned to meet WCAG AA contrast minimums for their _intended pairings_. Each token's `$description` names its role — read it to verify the pairing fits. Arbitrary `--clbr-color-*` combinations don't automatically satisfy AA.
- **`.visually-hidden` for SR-only context.** Calibrate ships a `.visually-hidden` utility class from Root. Use it for screen-reader-only text — accessible names for icon-only controls, state announcements (e.g. "step complete"), context that's redundant visually but needed for SR. Prefer a visible label, then `.visually-hidden`, then `aria-label` (last resort).
- **Don't remove or recolour the focus indicator.** Calibrate's Root CSS provides a focus-visible indicator on every interactive element — don't remove it, and don't change its color. Adjusting offset / inset / radius to fit a custom shape is fine. Wire your custom logic to keyboard events the same way you wire it to clicks.

Refer to [Using ARIA](https://www.w3.org/TR/using-aria/) before adding ARIA attributes. When implementing ARIA patterns, the APG below is the canonical reference — with caveats.

### [ARIA Authoring Practices Guide (APG) patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)

Partially trusted source. Use selectively.

**CAN reference:**

- Content in "About This Interaction" sections
- Content in "Keyboard Interaction" sections

**CANNOT reference:**

- Code examples from APG
- CodePen links (URLs starting with `https://codepen.io/`)

## CSS architecture

Match the system's CSS authoring pattern so your custom rules co-exist cleanly with system rules:

```css
:where(.clbr) .app-step-indicator {
  /* base styles */

  .step {
    /* descendant styles */
  }
}
```

- **`:where(.clbr)`** scopes selectors to a Calibrate Root. Your custom components must render inside a Calibrate Root (or any descendant of one) — the Root applies the system's foundational styles (typography, color context, brand) that your custom CSS inherits and composes against, and provides the `.clbr` ancestor the `:where(.clbr)` selector matches. `:where()` contributes zero specificity, so the root selector sits at `0,1,0` — matching how the system scopes its own rules. Nested descendant and state selectors follow normal CSS specificity from there. Combined with standard CSS source order (e.g. your custom CSS loaded after `@measured/calibrate-core/styles.css`), conflicts resolve predictably in your favour.
- **Project-prefixed class names** (`.app-*`, `.my-*`, anything but `.clbr-*`) avoid collisions with system class names. Prefix the component-level class; nest descendants unprefixed (mirroring how the system authors its own components).

## Smell tests

You've gone past "filling a gap" and started building parallel infrastructure when:

- You're using raw values (e.g. `16px`, `#ffaa00`, `0.5s`) or wrong-category tokens (e.g. `padding: var(--clbr-color-foreground-default)`) for design values. Lint catches most foot-guns but has gaps. Every design value should resolve to a `var(--clbr-*)` whose name matches the property's intent.
- You're writing CSS that targets Calibrate's `.clbr-*` component classes or any of their descendants. Don't override Calibrate component internals from the consumer side — ever. Use the component's prop surface, switch surface context, or fill the gap with a custom `.app-*` component instead.
- Your tokens look like a parallel theming layer with `--clbr-` prefixes you defined yourself. Don't squat on the namespace; pick `--my-*` or your own app/project prefix for any project-specific custom properties.
- You're disabling lint rules to ship. The disable comment should carry rationale that survives review — if it'd surprise a future reader, the right move is usually a system change (a missing token, a refined component) rather than a permanent escape.

## Examples

Worked examples live alongside this skill:

- `examples/core/` — for `@measured/calibrate-core` consumers (SSR / web components / template strings).
- `examples/react/` — for `@measured/calibrate-react` consumers.

Pick the flavor matching your project.

## References

- Token catalog (CSS, browseable in your editor): `@measured/calibrate-config/clbr.catalog.css`
- Token data (JSON, for agents and tooling): `@measured/calibrate-tokens/msrd`, `@measured/calibrate-tokens/base`
- Component catalog (live): <https://calibrate.msrd.dev/storybook>
- Component SPECs: imported from `@measured/calibrate-core` (e.g. `CLBR_BUTTON_SPEC`) — runtime values with top-level `description` and per-prop documentation. Confirms what each component does before you reach for raw HTML.
