---
"@measured/calibrate-assets": patch
"@measured/calibrate-config": patch
"@measured/calibrate-core": patch
"@measured/calibrate-markdown": patch
"@measured/calibrate-react": patch
"@measured/calibrate-tokens": patch
---

Add concise `description` to each public package's `package.json` and align the README's first paragraph to match. The descriptions are what npm shows in list views; they were previously empty across the repo, leaving npm to fall back to whatever appeared in the README first line.
