# Example session — bare machine to a verified install

A worked bootstrap conversation: detect → provision → verify → prove.
Outputs from `verify-install.mjs` and `ge doctor --local` are real, trimmed.
Read this when it's unclear which phase you are in or what a passing (or
failing) check actually looks like.

## The ask

> Operator: "Fresh Ubuntu VM, nothing on it but git and curl. Get the factory
> installed and prove it works — don't ask me to run anything."

Constraints extracted: no human hands → every phase must be self-checked
before moving on; "prove it works" → the session ends at `ge prove`, not at
"Setup done." text.

## Step 1 — detect what already exists (never reinstall blindly)

```console
$ command -v git curl mise bun
/usr/bin/git
/usr/bin/curl
```

Decision: git + curl present, mise and bun absent, no checkout → run phases
0 → 1 → 2 in order. On a machine where `mise --version` already answers,
skip straight to phase 2's check.

## Step 2 — phases 0–2: clone, mise, toolchain + deps + `ge`

```console
$ git clone https://github.com/vamsiramakrishnan/ge-agent-factory.git
$ cd ge-agent-factory
$ curl https://mise.run | sh
$ export PATH="$HOME/.local/bin:$PATH"
$ eval "$(mise activate bash)"
$ mise trust && mise install     # pinned Bun, Python, uv, Terraform
$ mise run setup                 # bun install → catalog + deps + ge install + skills-sync + daemon
…
Setup done.
```

"Setup done." is not the verdict — the daemon step inside setup is
best-effort (`|| true`). Verification is the next step, always.

## Step 3 — verify (structured, one line per phase)

```console
$ node skills/installing-the-factory/scripts/verify-install.mjs
✓ repo checkout  /home/user/ge-agent-factory
✓ bun (toolchain)  bun 1.3.11
✓ workspace deps  node_modules present
○ ge command installed  /home/user/.local/bin/ge missing
    fix: mise run setup   (or: mise run install)
✓ ge answers  ge --help renders
✓ skills manifest synced  .ge/skills/manifest.json
○ config (.ge.json)  not configured yet (fine for a fresh install)
    fix: bun tools/ge.mjs init
○ mise  mise not found, but the toolchain works without it (provisioned another way)
    fix: curl https://mise.run | sh && export PATH="$HOME/.local/bin:$PATH"

install verified — next: bun tools/ge.mjs prove
```

Reading the glyphs: `✓` required-and-passing, `✗` required-and-failing,
`○` advisory. This run (taken in a sandbox where bun was preinstalled) shows
the mise check demoting itself to advisory: the *outcomes* (bun, deps, `ge`
answering) all pass, so a missing mise is noted, not fatal. `.ge.json`
missing is configuration, not a broken install.

Then the factory's own readiness view:

```console
$ bun tools/ge.mjs doctor --local
  toolchain  (2 fail)
  ✓ bun installed                  v1.3.11
  ✓ uv installed                   uv 0.8.17
  ✓ python 3.11                    /usr/local/bin/python3
  ✗ agents-cli                     not found
      fix: uv tool install google-agents-cli
  ✗ google-antigravity SDK         not importable (python3)
      fix: mise run deps  (creates .venv via uv + installs the SDK)
  ✓ harness skills manifest        19 skills discoverable
  …
✗ 2 hard failure(s).
```

Decision: doctor names its own fixes — run them verbatim (`mise run deps`,
`uv tool install google-agents-cli`), then re-run doctor until green. Do not
improvise alternative installs; versions are pinned by mise.

## Step 4 — configure and prove

```console
$ bun tools/ge.mjs init          # writes .ge.json; cloud values may stay unset
$ bun tools/ge.mjs prove
Prove
  fresh machine — proving from scratch (health check → first agent build)
  ✓ proof passed → previewed
  next  ge handoff agents-cli   (hand the proven agent to the cloud)
```

## Step 5 — report back

> Agent: "Installed and verified: toolchain provisioned by mise (bun 1.3.11),
> deps installed, `ge` answering, `verify-install.mjs` exits 0, doctor local
> green, and the first proof passed (health check → first agent built from
> the catalog). Nothing touched GCP. Next: `operating-the-factory` to build
> real agents, or `bun tools/ge.mjs init` with project values when cloud work
> starts."

## Failure variant — phase check fails (mise/bun missing mid-bootstrap)

Running the verifier *before* the toolchain phase (or after a PATH problem
ate the shims) fails loudly with the exact fix per phase:

```console
$ node skills/installing-the-factory/scripts/verify-install.mjs
✓ repo checkout  /home/user/ge-agent-factory
✗ bun (toolchain)  bun not resolvable — toolchain not provisioned
    fix: mise trust && mise install
✓ workspace deps  node_modules present
○ ge command installed  /home/user/.local/bin/ge missing
    fix: mise run setup   (or: mise run install)
✗ ge answers  bun unavailable
    fix: mise run setup
✓ skills manifest synced  .ge/skills/manifest.json
○ config (.ge.json)  not configured yet (fine for a fresh install)
    fix: bun tools/ge.mjs init
✗ mise  mise not on PATH (or ~/.local/bin)
    fix: curl https://mise.run | sh && export PATH="$HOME/.local/bin:$PATH"

install NOT verified — 3 required check(s) failing
$ echo $?
1
```

React in order, not in bulk: the first failing *required* check is the
phase to fix — here mise is genuinely required (the outcome checks fail, so
it is no longer advisory). Run its printed fix, re-export PATH for this
shell, then `mise trust && mise install`, and re-run the verifier. The
workflow is idempotent — re-running a phase that already passed is safe,
inventing a hand-install of bun to bypass mise is not.
