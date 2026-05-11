---
"@measured/calibrate-core": patch
---

Button: fix Safari layout bug where fill icons inside icon-only buttons blew out the inline size. The `.icon-wrapper` had only `block-size` defined, leaving Safari free to size the inline axis to whatever the SVG's intrinsic aspect ratio suggested — which for `fill` icons (sized to fill their host) becomes "as wide as available". `aspect-ratio: 1 / 1` constrains the wrapper to a square so the inline size tracks the block size correctly. Same render in Chrome and Safari now.
