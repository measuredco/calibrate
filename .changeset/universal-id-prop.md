---
"@measured/calibrate-core": minor
---

Add an optional `id` prop to every component that didn't already accept one. Placement is semantic: structural / presentational components (Alert, Avatar, Badge, Banner, Blockquote, Box, Card, Container, Details, Divider, Expander, Figure, Grid, GridItem, Heading, Icon, Image, Inline, Logo, Nav, Page, Panel, Pattern, Poster, Prose, Root, Shape, Spinner, Stack, Surface, Text) emit `id` on the outermost host element; interactive non-form components (Link) emit it on the actual interactive element; form controls (Checkbox, Switch) emit it on the inner labelled input.

The id is validated against the HTML id syntax. Consumers retain control of id generation; the renderer never auto-generates ids to avoid SSR/hydration leaks. Components that already required an `id` (Range, Sidebar) for aria relationships keep their existing required-prop semantics.
