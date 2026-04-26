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

- **Conventional Commits** enforced on PR titles via [`.github/workflows/pr-title.yml`](.github/workflows/pr-title.yml). Squash-merge means the PR title becomes the commit subject on `main`, so this is the canonical validation surface.
- **Required commit scopes**: `adapter`, `assets`, `config`, `core`, `react`, `system`, `repo` (apps and root config use `repo`), plus `deps` for Dependabot PRs.
- **Pre-commit auto-formatting** via Husky + `lint-staged`: prettier runs on staged files before each commit, no opt-in.
- **Changesets required** when a PR touches `packages/{core,react,config,assets}/src/**`. Run `pnpm changeset` per consumer-visible change.

## Releasing

Releases are driven by [changesets](https://github.com/changesets/changesets) with `fixed` lockstep across all workspace packages. Authors add changeset files via `pnpm changeset` per PR. The bot accumulates them on `main` and opens a persistent **"Version Packages"** PR aggregating queued changesets. Merging that PR triggers npm publish via [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC + provenance, no long-lived token in the repo).

### Known gotcha — Version Packages PR CI

The bot-opened Version Packages PR hits GitHub Actions' infinite-loop suppression: PRs created using the default `GITHUB_TOKEN` don't trigger downstream workflows, so required status checks sit at "Expected — Waiting for status to be reported" indefinitely. Unblock with a close + reopen from your account:

```sh
gh pr close <number> && gh pr reopen <number>
```

That re-emits the `pull_request` events as you (not the bot), and CI fires normally. Merge once green.

## Roadmap

[`docs/PLANNING.md`](docs/PLANNING.md).
