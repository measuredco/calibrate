# Vendored DTCG Schemas

Schemas in `tokens/schemas/2025.10` are vendored from the official DTCG endpoints and committed for reproducibility.

## Refresh / version bump (manual)

When updating schema versions, do it intentionally and manually:

1. Download the official schema files from `https://www.designtokens.org/schemas/<version>/`.
2. Place them under `tokens/schemas/<version>/` preserving relative paths.
3. Update `$schema` paths in:
   - `tokens/src/**/*.json`
   - `tokens/resolver/**/*.resolver.json`
4. Validate JSON and schema resolution in VS Code.
