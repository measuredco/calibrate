---
"@measured/calibrate-core": patch
---

Set `min-block-size: 100dvb` on the Root element when `appRoot` is true. Apps wrapping their tree in `<Root appRoot>` (or `renderClbrRoot({ appRoot: true })`) now fill at least the dynamic viewport's block dimension by default — so a sticky footer sits at the viewport edge rather than mid-content when the page body is short. Uses dynamic viewport units (`dvb`) so mobile browser chrome is respected.
