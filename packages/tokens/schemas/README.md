# Vendored DTCG Schemas

Schemas in `packages/tokens/schemas/<version>/schema/` are vendored from the official DTCG endpoints and committed for reproducibility.

Reference spec markdown is also vendored under `packages/tokens/schemas/<version>/spec/` for local/offline guidance. Treat `spec/` as reference docs, not runtime schema inputs.

## Refresh / version bump (manual)

When updating schema versions, do it intentionally and manually:

1. Download the official schema files from `https://www.designtokens.org/schemas/<version>/`.
2. Place schema JSON files under `packages/tokens/schemas/<version>/schema/` preserving relative paths.
3. Place optional reference markdown under `packages/tokens/schemas/<version>/spec/`.
4. Update `$schema` paths in:
   - `packages/tokens/src/**/*.json`
   - `packages/tokens/resolver/**/*.resolver.json`
5. Validate JSON and schema resolution in VS Code.
