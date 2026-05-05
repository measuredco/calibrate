## @measured/calibrate-skills

Markdown guardrails for AI coding agents (and humans) building sites and apps with Calibrate.

Each skill is a folder containing a `SKILL.md` (with `name` and `description` frontmatter) plus optional sibling `examples/`, `references/`, and `assets/` folders. The shape is shared by Claude Code and OpenAI Codex, so authoring vendor-neutral skills works in both.

## Install

```sh
pnpm add -D @measured/calibrate-skills
```

## Use

Copy or symlink the skill folders this package ships into your agent's discovery directory:

- **Claude Code** → `.claude/skills/`
- **OpenAI Codex** → `.agents/skills/`

```sh
# Example: install all skills for Claude Code
cp -r node_modules/@measured/calibrate-skills/src/* .claude/skills/
```

Refer to your agent's documentation for the canonical discovery paths.
