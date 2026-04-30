---
"@measured/calibrate-core": minor
"@measured/calibrate-react": minor
---

Add an `id` prop to every component that didn't already accept one. Placement is semantic: structural / presentational components (Alert, Avatar, Badge, Banner, Blockquote, Box, Card, Container, Details, Divider, Expander, Figure, Grid, GridItem, Heading, Icon, Image, Inline, Logo, Nav, Page, Panel, Pattern, Poster, Prose, Root, Shape, Spinner, Stack, Surface, Text) emit `id` on the outermost host element; interactive non-form components (Link) emit it on the actual interactive element; form controls (Checkbox, Switch) emit it on the inner labelled input.

Consumers retain control of id generation; the renderer never auto-generates ids to avoid SSR/hydration leaks.

**Breaking changes** (alpha — bumped as minor per the existing posture):

- `Checkbox` and `Switch` drop their `descriptionId` prop. When `description` is provided, `id` is now required and the description element's id is derived as `${id}-description`. This aligns them with `Input`, `Textarea`, `Range`, `Radios`, and `Fieldset`, which already followed this pattern.
- `Icon` drops its `titleId` prop. When `ariaHidden` is false, `id` is now required and the title element's id is derived as `${id}-title`.

Migration: replace `descriptionId="my-id"` with `id="my-id"` on Checkbox/Switch, and `titleId="my-id"` with `id="my-id"` on Icon (in named mode). The derived id is internal and rarely needs to be referenced directly.
