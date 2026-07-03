# Machine setup — what each phase actually provisions

## Phase map

| Phase | Command | Provisions | Check |
| --- | --- | --- | --- |
| Repo | `git clone …/ge-agent-factory.git` | the source tree, `mise.toml` at root | `test -f mise.toml` |
| mise | `curl https://mise.run \| sh` | the toolchain manager + task runner in `~/.local/bin/mise` | `mise --version` |
| Toolchain | `mise trust && mise install` | pinned Bun, Python, uv, Terraform (versions in `mise.toml`) | `bun --version` (inside the repo) |
| Setup | `mise run setup` | `bun install` (workspace deps), use-case catalog sync, Python venv deps (uv), the `ge` command into `.local/bin/`, skills manifest (`.ge/skills/`), local run daemon (best-effort) | `verify-install.mjs` |
| Config | `bun tools/ge.mjs init` | `.ge.json` (+ `$schema` for editor validation) | `bun tools/ge.mjs config` |
| Proof | `bun tools/ge.mjs prove` | first validated agent workspace under `.ge/factory/workspaces/` | exit 0 |

## Environment variables that redirect things

| Variable | Redirects | Default |
| --- | --- | --- |
| `BIN` | where the `ge` command is installed | `~/.local/bin` |
| `AGENTS_SKILLS_DIR` | where `mise run skills-install` symlinks the skills | `~/.agents/skills` |
| `GE_STATE_ROOT` | where all `.ge/` state lives (useful in sandboxes/tests) | `<repo>/.ge` |
| `GE_DAEMON_PORT` | the local run daemon's port | `17654` |

## PATH notes

- mise installs to `~/.local/bin` and manages tool shims via `mise activate`.
  In non-interactive shells (CI, assistant sandboxes), prefer absolute
  invocations: `~/.local/bin/mise …` and `bun tools/ge.mjs …` from the repo
  root — they work without shell activation.
- The repo's `mise.toml` also prepends `<repo>/.local/bin` to PATH for tasks,
  which is where `mise run setup` installs `ge`.

## Sandboxes, proxies, offline

- Everything local (`ge prove`, tests, cassette replays) needs no GCP
  credentials — a fresh install must NOT touch the cloud (that is the config
  contract's fail-safe default).
- Behind a corporate proxy, `curl https://mise.run` and `bun install` follow
  the standard `HTTPS_PROXY`/CA-bundle env vars; do not disable TLS
  verification to make them pass.
- The daemon start inside `mise run setup` is `|| true` on purpose: sandboxes
  that forbid long-lived processes still complete setup; start it later with
  `bun tools/ge.mjs daemon start`.

## Uninstall

- Repo-local: delete the checkout (all state is under `<repo>/.ge`).
- `ge` command: remove `~/.local/bin/ge` (or `$BIN/ge`).
- Skills symlinks: `rm -f ~/.agents/skills/*` (symlinks only).
- mise itself and its tool cache: `rm -rf ~/.local/bin/mise ~/.local/share/mise`.
