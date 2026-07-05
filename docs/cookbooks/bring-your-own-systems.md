---
title: Bring your own systems
parent: Guides
nav_order: 16
layout: default
description: The BYO insertion points end to end — bind a system to a live target, package every customization into one manifest, and check what's read for real.
---

# Bring your own systems

**Scope:** local-only, read-only-by-default — `ge systems doctor`/`ge byo
doctor`/`ge models doctor` never touch the network or GCP; `ge systems
bind`/`unbind` and `ge byo apply` write local `.ge/` state or `.ge.json`;
nothing here uploads or deploys anything.

## When to use this

"Bring your own" (BYO) is not one command — it is every point where an
enterprise's own systems, evals, models, and policies enter the factory line
without forking it. Reach for this guide when you already have a source
system to point an agent at (rather than synthesizing a fresh twin — see
[Capture a source system from OpenAPI](capture-from-openapi.html) for that),
or when you want to package a whole set of customizations — system
bindings, eval packs, model choices, admission policy, the generated-agents
repo — into one file an operator can validate and apply in one pass.

## The insertion points

| You bring | Command | Where it lands |
|---|---|---|
| A live system to call instead of (or alongside) a simulated twin | `ge systems bind` | `.ge/systems/bindings.json` |
| A bring-your-own ADK-compatible evalset | `ge evals import` | `.ge/behavioral/<id>.evalset.json` |
| A domain-specific invariant/eval-seed pack | `evals.domainPacks` in a BYO manifest | checked against `domain-packs/<id>/pack.json` |
| A durable overlay backend for BYO twins | `simulatorOverlayBackend` (config field or manifest) | `.ge.json`, forwarded to `ge mcp deploy` |
| A preferred refinement/judge model | `refinementModel`/`judgeModel` (config field or manifest) | `.ge.json`, reported by `ge models doctor` |
| Admission/promotion policy | `policies.admission`/`policies.promotion` in a BYO manifest | `.ge.json` `promotion.gates.*` |
| Where generated agent code lives | `agentsRepo` (config field or manifest) | `.ge.json` |
| Everything above, as one reviewable file | `ge byo doctor` / `ge byo apply` | `ge.byo.yaml` → whichever of the above is `appliable` |

## System bindings — bind, doctor, unbind

A contract system can run three ways: a simulated **twin** (the default —
nothing to bind), a live target reached over **MCP**, or a live target
reached over **REST**. `ge systems bind` records which one a system id
should use:

```bash
ge systems bind crm \
  --to https://crm.internal.example.com \
  --kind rest \
  --mode twin_first \
  --connector salesforce
```

- `--kind` — `twin` | `mcp` | `rest`: what kind of target `--to` points at.
- `--mode` — `twin_first` | `live_first` | `twin_only`: call-order precedence
  between the simulated twin and the live target. `twin_first` tries the
  twin and falls back to live; `live_first` is the reverse; `twin_only`
  ignores the binding for calls (useful for recording a binding before the
  live target is ready).
- `--connector` is informational today (no connector SDK yet) — it's a
  name your own tooling can key off, not a factory-resolved plugin.
- `--config` takes inline JSON or a path to a JSON file of connector config.

This validates the shape (an `mcp`/`rest` target must be an `http(s)` URL)
and writes a `SystemBinding` (`ge.system-binding.v1`) to
`.ge/systems/bindings.json`, keyed by system id. List and remove bindings
with the read-only/mutating pair:

```bash
ge systems bindings      # read-only — list what's bound
ge systems unbind crm    # remove a binding (removed:false if it wasn't bound — not an error)
```

`ge systems doctor` cross-checks the whole toolchain — the Python
interpreter, `synthesize_cli.py`'s presence, `registry.json`'s
parseability, every stored binding, and the overlay backend's durability —
in one read-only pass:

```console
$ ge systems doctor
Systems doctor
  ✓ python             python3 (Python 3.11.15)
  ✓ synthesize_cli.py  apps/factory/mcp-service/synthesize_cli.py
  ✓ registry.json      89 system(s) at apps/factory/simulator-systems/registry.json
  ✓ bindings           no live system bindings configured — systems run twin-only until bound (ge systems bind)
  ✓ overlay backend    <unset> — in-process overlay only; BYO synth results and twin bindings are NOT durable across replicas/restarts.
  ✓ overlay scope      session-only (in-process) — twins will not survive replica restarts
```

## Overlay scope, by mode

A synthesized or bound twin lives in the simulator engine's **overlay** —
the in-memory registration that makes it resolvable to a running
mcp-service. `resolveOverlayScope()` (`packages/byo-systems/src/index.mjs`)
decides where that overlay's state lives:

| Mode | Overlay backend | Durable? |
|---|---|---|
| local (default, nothing set) | `memory` (in-process) | No — lost on process restart; each Cloud Run replica sees a different overlay |
| remote (`ge mode remote`, nothing set) | `firestore` (auto-injected) | Yes — shared across replicas |
| either, `GE_SIMULATOR_OVERLAY_BACKEND`/`simulatorOverlayBackend` set explicitly | whatever you set (`memory`\|`firestore`\|`alloydb`) | Depends on the backend |

An explicit setting always wins over the mode-based default. Set it before
synthesizing or binding a system you need to survive a replica restart —
see [Config — `simulatorOverlayBackend`](../reference/config.html#fields).

## The `ge.byo.yaml` manifest

A manifest packages every insertion point above into one file, so an
operator gets one validate-and-apply pass instead of running each command by
hand. The checked-in example (`ge.byo.example.yaml`, repo root) exercises
every section:

```yaml
schemaVersion: ge.byo.v1
blueprints:
  libraries: [okf/aml-alert-investigation-agent]
systems:
  overlays: { backend: firestore }
  bindings:
    crm: { system: crm, kind: rest, boundTo: https://crm.internal.example.com, mode: twin_first, connector: salesforce }
fixtures:
  packs: [apps/factory/tests/fixtures/cloud-data-golden]
evals:
  packs: [generated-agents/ap-aging-analyzer/tests/eval/evalsets/ge_behavior_contract.evalset.json]
  domainPacks: [aml]
models:
  refinement: gemini-3.5-flash
  judge: gemini-flash-latest
policies:
  admission: { required: true, maxAgeDays: 14 }
  promotion: { requireLiveProof: true }
code:
  generatedAgentsRepo: git@github.com:example-enterprise/generated-agents.git
cloud:
  project: example-enterprise-prod
  region: us-central1
```

`ge.byo.yaml` is not the same file as `ge.manifest.json` (`ge apply`'s
desired platform/fleet state — which planes should be up, which agents
should reach which stage). This one is customization/config: which
blueprint libraries an enterprise draws from, its system bindings, its
fixture and eval packs, its model and policy choices, and its target
project.

Validate a manifest and see the full plan — read-only, nothing executed:

```console
$ ge byo doctor --manifest ge.byo.example.yaml
BYO manifest doctor — ge.byo.example.yaml

  Plan
  ▲ blueprints.libraries      okf/aml-alert-investigation-agent  planned-only
  ✓ systems.overlays.backend  simulatorOverlayBackend  appliable
      will set .ge.json simulatorOverlayBackend = "firestore" (current: memory)
  ✓ systems.bindings          crm  appliable
  ▲ fixtures.packs            apps/factory/tests/fixtures/cloud-data-golden  planned-only
  ✓ evals.packs               generated-agents/ap-aging-analyzer/tests/eval/evalsets/ge_behavior_contract.evalset.json  appliable
  ▲ evals.domainPacks         aml  planned-only
  ✓ models.refinement         refinementModel  appliable
      will set .ge.json refinementModel = "gemini-3.5-flash" (current: gemini-3.5-flash)
  ✓ models.judge              judgeModel  appliable
  ✓ policies.admission        promotion.gates.admission  appliable
  ✓ policies.promotion        promotion.gates.promotion  appliable
  ✓ code.generatedAgentsRepo  agentsRepo  appliable
  ✓ cloud.project             project  appliable
  ✓ cloud.region              region  appliable

✓ manifest valid; plan computed.
```

Every action is classified `appliable` (writes real `.ge.json`/local state
today), `planned-only` (checked and reported, but a later stage consumes
it — nothing is silently dropped), or `invalid` (with a fix). Three
sections stand out:

- **`systems.overlays.backend`** and **`systems.bindings`** are appliable
  today — the first merges onto `simulatorOverlayBackend`, the second
  writes real `SystemBinding` records via `@ge/byo-systems`.
- **`models.refinement`/`models.judge`** are appliable — they merge onto
  the `refinementModel`/`judgeModel` config fields `ge models doctor`
  reports on (see the note on those fields in
  [Config](../reference/config.html#fields) for what they do and don't
  change yet).
- **`blueprints.libraries`**, **`fixtures.packs`**, and
  **`evals.domainPacks`** are planned-only — this manifest only reports
  whether the referenced path/id exists; a later stage (library creation,
  data packaging, enrichment) is what actually consumes them.

Apply the safe subset for real, or preview it first:

```bash
ge byo apply --manifest ge.byo.example.yaml --dry-run   # report the plan; execute nothing
ge byo apply --manifest ge.byo.example.yaml             # merge .ge.json, import eval packs, write bindings
```

## Bring your own evals

`ge evals import` takes any ADK (Agent Development Kit)-compatible evalset
file you already have and drops it alongside compiled output, so
`ge evals coverage`/`ge prove --live` can see it:

```bash
ge evals import --evalset path/to/your.evalset.json --id my-hand-written-suite
ge evals coverage --id my-hand-written-suite
```

`--id` defaults to the file's own `evalSetId`/`id`, or a filename slug, if
you don't set one; import refuses to overwrite an existing id without
`--force`. `ge evals coverage` (no `--id`) reports the last `ge evals
compile`'s coverage — per-dimension required/covered/gaps and a flattened
gap list — regardless of whether any evalsets were imported.

## Models doctor

`ge models doctor` is the structural check for model configuration —
never a network or paid call:

```console
$ ge models doctor
Models doctor — <no project>
  ✗ vertex.project    no GCP project configured (cfg.project unset)
      fix: ge init  (or set GOOGLE_CLOUD_PROJECT)
  ✗ vertex.gcloud     gcloud not found on PATH
  ▲ harness.python    fallback (no override, no repo .venv) — google-antigravity may not be importable
  ✓ model.refinement  gemini-3.5-flash (recognized family)
  ✓ model.judge       gemini-flash-latest (recognized family)
  ▲ adc               no GOOGLE_APPLICATION_CREDENTIALS and no application-default credentials found
```

`model.refinement`/`model.judge` warn (never fail) if `refinementModel`/
`judgeModel` doesn't match a known family (`gemini-*`, `claude-*`,
`gpt-*`) or is unset. Run it after `ge init` and `mise run deps` to confirm
the toolchain a BYO manifest's `models.*` section reports against is real.

## Common failures

- **`ge systems bind` rejects the target** — `--kind mcp`/`rest` requires
  `--to` to parse as an `http(s)` URL; a twin pack id doesn't.
- **A twin doesn't survive a redeploy** — the overlay backend is `memory`
  (the local default). Set `simulatorOverlayBackend: firestore` (or run in
  remote mode, which auto-injects it).
- **`ge byo doctor` reports a section `invalid`** — the manifest fails
  strict shape validation (unknown top-level/section key, wrong
  `schemaVersion`, or an unrecognized `systems.overlays.backend` value) or
  the referenced path/evalset file doesn't exist; the reported `fix`
  names exactly what to correct.
- **`ge evals import` refuses to write** — an evalset already exists at that
  id; pass `--force` to overwrite, or pick a different `--id`.

## Repair

- Re-run `ge systems doctor` after fixing a reported toolchain check —
  it never throws, so it's safe to loop.
- Re-run `ge byo doctor --manifest <path>` after editing the manifest; fix
  reported `invalid` actions one at a time, they don't block each other.
- If `ge byo apply` applied something you didn't mean to change, `.ge.json`
  is a plain JSON file — edit or revert the affected key by hand.

## Next step

Once a system is bound (or a manifest applied), [prove the
agent](prove-an-agent.html) against it, or [admit it](admit-an-agent.html)
once its evals and policy are the ones you actually run in production.
