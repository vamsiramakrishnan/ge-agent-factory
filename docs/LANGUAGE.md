---
title: The language
nav_order: 8
---

# The language

One page on how this product speaks, and the gate that keeps it honest
(`bun run lang:gate`, wired into CI). If you are adding a command, a console
label, a doc page, or an error message, this is the contract it must meet.

## The mental model: a compiler for agents

The factory already has a compile/link boundary — the docs call it the build
boundary. The language leans into it, because every developer already knows
how a compiler talks:

| Compiler concept | Factory concept | What it is |
|---|---|---|
| Source code | **Contract** (Enterprise Agent Contract) | The captured, human-readable statement of what the agent must do, with authority and evidence attached |
| Compile + test | **Prove** | Turn contracts into working agents and run their evals — pure computation on this machine, up to the boundary |
| Signed artifact | **Passport** (with its proof pack) | The evidence bundle a proven agent carries: eval results, spec-to-code trace, verify verdicts |
| Deploy / link | **Handoff** | Give the proven artifact to a runtime target (agents-cli → Agent Engine → Gemini Enterprise) |

Everything before handoff is local and repeatable — safe to loop (`ge prove
--watch`). Everything after touches your cloud project and stays deliberate.

## The two registers

The product speaks two registers on purpose. Both are legitimate; only one is
allowed to lead.

**Golden register** — the words a stranger meets first. They name *what you
have*, not *how the machinery does it*:

`agent` · `contract` · `source system` · `eval` · `proof` · `proof pack` ·
`passport` · `capture` · `prove` · `handoff`

**Operator register** — the machinery's own names, for people running the
factory in anger. Real, documented, never deleted — but they live behind the
front door (the `Operate` sections, the reference pages, `<details>` blocks):

`planes` · `daemon` · `canary` · `OKF` · `harness` · `fleet` · `pipeline` ·
`devex` · `mode`

The gate (`tools/lang-gate.mjs`) fails CI when an operator-register word
appears in the golden zones: `README.md` above the `## Operate` heading, the
Start Here and Concepts doc pages, and the Golden path section of `ge --help`.
Content inside `<details>` blocks is exempt — collapsing *is* the sanctioned
way to disclose machinery. [`GLOSSARY.md`](GLOSSARY.md) defines every term in
both registers, golden first.

## The Review Board

Every interface decision here had to survive this board. The questions are
theirs; the answers are this change-set's, written for the three verbs.

**Stripe — does every error carry a fix? Is the CLI the product?**
The error contract is `{ what, where, why, fix }` (`tools/lib/errors/dx-error.mjs`),
where `fix` is a literal command; the renderer prints all four and `--json`
emits them structurally. Registered error codes additionally deep-link the
docs site. The CLI is a first-class product surface: bare `ge` is a designed
board, not a usage dump.

**Rust — does the error teach? Are the verbs pure?**
`what` names the failure, `where` points at the thing (a config key, a file,
a stage), `why` explains in cause terms, `fix` is exact. One verb, one
meaning: `capture` only captures, `prove` only proves, `handoff` only hands
off. None of them grew flags that change what they mean.

**Elm — any error without a suggestion?**
`fix` is a required field of the contract — an error you can't suggest a fix
for isn't understood well enough to throw at an operator. Doctor checks
carried `fix:` lines before this change; thrown errors now match them.

**Heroku — is the golden path one memorable line per stage?**
`ge capture` → `ge prove` → `ge handoff agents-cli`. Three lines, no flags,
`git push`-grade.

**fly.io — does one verb take a stranger from nothing to running? Honest copy?**
`ge prove` on a fresh clone runs the health check and builds a first agent to
a validated workspace with zero flags. The copy says what is console-first
today (capture) and what is roadmap (CLI-native capture, more handoff
targets) — no pretending.

**Vercel/Next — do defaults make flags unnecessary?**
Every golden-path flag is optional with a working default: `prove` picks its
own dispatch (fresh → first proof; built → re-prove), `handoff` defaults to
the one supported target. Flags exist for operators, not for the path.

**gh CLI — human output by default, `--json` everywhere, UI/CLI parity?**
Every command renders human text at a TTY and byte-stable JSON with `--json`
(errors included, via the contract). The console derives its "CLI: `ge …`"
chips from the same registry the CLI and MCP server read — parity is
structural, not aspirational.

**Vite — is feedback instant? Where's the watch loop?**
`ge prove --watch` re-proves on contract change. It is safe *because of* the
build boundary: everything it loops is pure local computation.

**Charm — is terminal output a designed artifact?**
The board answers three questions in three lines, aligned, with one color
system — the same status ramp the console renders, resolved to
nearest-ANSI for the TTY (`packages/design/src/status-ramp.mjs`).

**Tailwind — are the names themselves the API?**
`capture`, `prove`, `handoff` need no explanation next to them; the register
table above is the naming API. Docs show the three lines before telling
anything.

**Linear — is state legible in one glance? Opinionated defaults?**
Bare `ge`: position on capture → prove → handoff (current stage lit), the
blocker, the exact next command — one glance. The board decides what you
should do next rather than offering a settings tree.

**Bun — is speed treated as courtesy?**
Position comes from cheap local reads (file state + the run ledger), so the
board stays instant; long operations announce their expected duration up
front and report actual duration after.

## Renames

None. This change-set is additive by law: the golden verbs are a new front
door over implementations that keep their operator names (`devex smoke`,
`agents build`, `agents ship`) forever-working. A rename sweep only becomes
safe once the additive verbs have adoption; until then, every old spelling
keeps working and the deprecated aliases keep pointing at the canonical ones.
