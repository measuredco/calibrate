# Calibrate

Calibrate is a multi-brand design system: a token foundation, a component library, and the framework adapters that ship them.

This is a pnpm monorepo with lockstep versioning across publishable and private packages.

## Packages

| Package                       | Path                                   | Public | Description                                                                                                                       |
| ----------------------------- | -------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `@measured/calibrate-core`    | [`packages/core`](packages/core)       | yes    | SSR-first component library and primary consumer-facing CSS entrypoint (`@measured/calibrate-core/styles.css`).                   |
| `@measured/calibrate-react`   | [`packages/react`](packages/react)     | yes    | React adapter — generated wrappers over the core IR.                                                                              |
| `@measured/calibrate-assets`  | [`packages/assets`](packages/assets)   | yes    | Runtime assets (fonts today).                                                                                                     |
| `@measured/calibrate-config`  | [`packages/config`](packages/config)   | yes    | Shared consumer/tooling config presets (browserslist, esbuild target).                                                            |
| `@measured/calibrate-system`  | [`packages/system`](packages/system)   | no     | Token authoring + resolver/build pipeline. Outputs feed core's CSS. See [`packages/system/README.md`](packages/system/README.md). |
| `@measured/calibrate-adapter` | [`packages/adapter`](packages/adapter) | no     | Codegen for framework adapters (drives `react`'s wrapper generation).                                                             |

## Apps

| App                | Path                                             | Description                                 |
| ------------------ | ------------------------------------------------ | ------------------------------------------- |
| Storybook          | [`apps/storybook`](apps/storybook)               | Component dev and a11y harness.             |
| Playground (React) | [`apps/playground-react`](apps/playground-react) | Real-browser harness for the React adapter. |

## Working in the repo

```sh
pnpm install
```

Common scripts (root, delegating via workspace filters):

- `pnpm core:test` / `pnpm core:build` / `pnpm core:typecheck`
- `pnpm react:test` / `pnpm react:build` / `pnpm react:generate`
- `pnpm system:build` / `pnpm system:validate` / `pnpm system:verify`
- `pnpm storybook` / `pnpm storybook:build` / `pnpm storybook:test`
- `pnpm playground:react` / `pnpm playground:react:build`
- `pnpm lint` / `pnpm format` / `pnpm format:check`

## Contribution conventions

- **Conventional Commits** enforced via `commitlint` and a `commit-msg` Husky hook (`commitlint.config.cjs`).
- **Required commit scopes**: `adapter`, `assets`, `config`, `core`, `react`, `system`, `repo` (apps and root config use `repo`).
- **Releases** are driven by [changesets](https://github.com/changesets/changesets) with `fixed` lockstep across all workspace packages. Run `pnpm changeset` on any PR with consumer-visible changes; CI requires a changeset when `packages/{core,react,config,assets}/src/**` changes.

## Roadmap

[`docs/PLANNING.md`](docs/PLANNING.md).
