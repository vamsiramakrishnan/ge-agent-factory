# create-ge-agent-factory

Bootstrap the [GE Agent Factory](https://github.com/vamsiramakrishnan/ge-agent-factory)
from a bare machine with one command:

```bash
curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \
  | bun - -- --skills agents

curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \
  | bun - -- --yes --skills agents   # execute the phases instead of printing them
```

What it does, in order:

1. Clones the repo (or reuses the checkout you're in).
2. Prints — or with `--yes`, runs — the install phases: mise → pinned
   toolchain (Bun/Python/uv/Terraform) → `mise run setup` (deps, catalog, the
   `ge` command, skills, daemon) → structured verification.
3. Optionally symlinks the factory skills into your coding assistant's skill
   directory (`--skills claude|agents`, or `--skills gemini` for the one-line
   CLI extension install).
4. Hands over to the installer of record: the repo's own
   `skills/installing-the-factory` skill, which any supported coding assistant
   can follow phase by phase.

Zero dependencies; needs Node ≥ 18 and `git`.

## Other install channels

| Surface | One-liner |
| --- | --- |
| Plugin marketplace | `/plugin marketplace add vamsiramakrishnan/ge-agent-factory` → `/plugin install factory-bootstrap@ge-agent-factory` |
| Gemini CLI | `gemini extensions install https://github.com/vamsiramakrishnan/ge-agent-factory` |
| Antigravity / agents-cli / Codex | `curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \| bun - -- --skills agents` (or in-repo: `mise run skills-install`) |
| Any MCP client | `bun tools/mcp-server.mjs` from the repo root |

## Publishing (maintainers)

This package is versioned with the repo and published manually:

```bash
cd packages/create-ge-agent-factory
npm publish            # requires npm owner rights; publishConfig.access is public
```

Keep `bin/create-ge-agent-factory.mjs` dependency-free — it must run from
stdin, a packed tarball, or bare `npx`/`bunx` once published.

After publishing, the npm form is:

```bash
bunx create-ge-agent-factory --skills agents
```
