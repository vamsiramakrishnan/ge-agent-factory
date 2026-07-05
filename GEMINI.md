# GE Agent Factory — Gemini CLI context

GE Agent Factory compiles enterprise workflows into governed agent contracts,
generated agents, eval suites, and proof artifacts, then verifies the shipped
agent over the same live assist surface real users hit.

The golden path is three commands:

```bash
ge capture               # capture intent into a contract (console Interview)
ge prove                 # prove it: build the agent, run its evals
ge handoff agents-cli    # hand the proven agent to agents-cli → Agent Engine → Gemini Enterprise
```

Then verify the shipped agent live:

```bash
ge drive                 # talk to it over its live assist surface (per-turn timings + identity)
ge prove --live          # release verification: evalset cases through the live surface
ge bench                 # latency/error budgets as a pass/fail verdict
```

## If the factory is not installed yet

Follow the self-contained bootstrap skill at
`skills/installing-the-factory/SKILL.md` — it takes a bare machine to a
verified install (mise → Bun/Python/uv/Terraform → dependencies → the `ge`
command → first proof), checking each phase before the next.

## Skills

Every operator job is a skill under `skills/` (this extension ships them):
`installing-the-factory` (bootstrap), `operating-the-factory` (end to end),
`driving-live-proof` (live verification), plus stations for specs, builds,
simulators, releases, and triage. Trigger routing lives in
`skills/skill-routing.json`.

## Deeper context

Agent working notes (gates, conventions, layering rules): `AGENTS.md`.
Documentation: `docs/` (start with `docs/start/getting-started.md`).
The `factory_*` MCP tools this extension registers are derived from
`packages/capability-registry/src/registry.mjs` — same functions as the CLI verbs.
