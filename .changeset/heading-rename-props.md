---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Rename two `Heading` props for clarity:

- `children` → `text`
- `opticalInline` → `opticalAlign`

Update consumers to use the new names. The corresponding host attribute also renames from `data-optical-inline` to `data-optical-align`. Per the alpha versioning posture, this is a minor bump rather than a major.
