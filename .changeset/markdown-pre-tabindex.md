---
"@measured/calibrate-markdown": patch
---

Add `tabIndex="0"` to every `<pre>` element in the rendered output via a small inline rehype transform. Code blocks become horizontally-scrollable regions when content overflows; without the tabindex, keyboard users can't focus and scroll them. Resolves axe-core's `scrollable-region-focusable` rule.
