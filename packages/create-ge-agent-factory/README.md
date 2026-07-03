# create-ge-agent-factory

Bootstrap the [GE Agent Factory](https://github.com/vamsiramakrishnan/ge-agent-factory)
from a bare machine with one command:

```bash
bunx create-ge-agent-factory            # or: npx create-ge-agent-factory
bunx create-ge-agent-factory --yes      # execute the phases instead of printing them
bunx create-ge-agent-factory --skills claude   # also expose the skills to Claude Code
```

What it does, in order:

1. Clones the repo (or reuses the checkout you're in).
2. Prints — or with `--yes`, runs — the install phases: mise → pinned
   toolchain (Bun/Python/uv/Terraform) → `mise run setup` (deps, catalog, the
   `ge` command, skills, daemon) → structured verification.
3. Optionally symlinks the factory skills into your coding agent's skill
   directory (`--skills claude|agents`, or `--skills gemini` for the one-line
   Gemini CLI extension install).
4. Hands over to the installer of record: the repo's own
   `skills/installing-the-factory` skill, which any coding agent
   (Claude Code, Antigravity, Codex, Gemini CLI) can follow phase by phase.

Zero dependencies; needs Node ≥ 18 and `git`.

## Other install channels

| Assistant | One-liner |
| --- | --- |
| Claude Code | `/plugin marketplace add vamsiramakrishnan/ge-agent-factory` → `/plugin install factory-bootstrap@ge-agent-factory` |
| Gemini CLI | `gemini extensions install https://github.com/vamsiramakrishnan/ge-agent-factory` |
| Antigravity / agents-cli / Codex | `bunx create-ge-agent-factory --skills agents` (or in-repo: `mise run skills-install`) |
| Any MCP client | `bun tools/mcp-server.mjs` from the repo root |

## Publishing (maintainers)

This package is versioned with the repo and published manually:

```bash
cd packages/create-ge-agent-factory
npm publish            # requires npm owner rights; publishConfig.access is public
```

Keep `bin/create-ge-agent-factory.mjs` dependency-free — it must run under
bare `npx`/`bunx` on machines that have nothing else installed yet.
