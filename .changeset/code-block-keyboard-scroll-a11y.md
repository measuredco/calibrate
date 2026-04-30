---
"@measured/calibrate-markdown": patch
"@measured/calibrate-core": patch
---

Make fenced code blocks keyboard-accessible.

`@measured/calibrate-markdown`: a small inline rehype transform sets `tabIndex="0"` on the `<code>` element of every fenced code block. The `<code>` is the horizontally-scrollable region in prose styling, so keyboard users can now focus it and scroll. Inline `<code>` is unaffected. Resolves axe-core's `scrollable-region-focusable` rule.

`@measured/calibrate-core`: prose component now applies the `interactive-focus` token to the wrapper's decorative border on `:has(> code:focus-visible)`, giving keyboard users a visible focus state on the code block.
