# simulator-runtime

Feed it a JSON **pack corpus** and it serves a faithful, **stateful** MCP simulator for
every system in that corpus — with foreign-key integrity, idempotency, throttling,
webhooks, async jobs, and an audit trail. The engine is corpus-agnostic: point it at the
bundled corpus, a synthesized BYO pack, or your own directory of packs.

It has **no required third-party dependencies** — it runs fully in-memory out of the box.
Durable state backends and pack synthesis are optional extras.

## What it does

- **Stateful**: reads/writes go through a `StateStore`, so a tool call mutates state that
  later calls observe (e.g. a state-machine transition on a ticket).
- **Faithful**: FK integrity across collections, role-gated mutations, declared state
  transitions, approval blockers, deterministic injected failure modes, idempotency
  replay, rate limiting, webhook emission, and async (poll-for-result) jobs.
- **Pluggable state backend**: `memory` (default, per-process), `firestore`, or `alloydb`
  — selected per system via the contract's `stateBackend`, or globally via
  `GE_SIMULATOR_STATE_BACKEND`. A cloud backend that can't initialize degrades to memory
  so demos never hard-fail on infra. Bring your own by implementing the `StateStore`
  protocol in `simulator_runtime.state_store`.
- **Runtime overlay**: synthesized/BYO packs mount live (no restart) and resolve before
  the built-in corpus; the overlay can itself be made durable (Firestore/AlloyDB).

## The pack format

A **corpus** is a directory containing one `registry.json` (the index) plus one
sub-directory per system. Each system is described by up to six concept files
(legacy multi-file form):

| file                  | concept                                                            |
| --------------------- | ----------------------------------------------------------------- |
| `schema.json`         | collections, fields, primary keys, foreign keys                   |
| `seed.json`           | initial rows per collection                                       |
| `tools.json`          | the tool catalog (each tool's name + binding to a collection/op)  |
| `workflows.json`      | tool handlers: state machines, roles, transitions, approvals      |
| `projection.json`     | read-shaping (how stored rows are projected to tool results)      |
| `materialization.json`| write-shaping (how tool args materialize into stored rows)        |

Packs may also be stored as a single canonical `pack.json` (every section inline under
concept keys), or registered **inline** at runtime (synthesized packs with no files).
`registry.json` entries point at the files (`schemaPath`/`toolsPath`/…) or carry a
`packPath`/inline sections. See `simulator_runtime/pack_loader.py` for the three shapes.

## Pointing it at your own corpus

The corpus location is **injectable** — there are no app-relative paths baked into the
package. Resolution order (first hit wins):

1. an explicit `configure(...)` / `set_packs_dir(...)` call;
2. the `GE_SIMULATOR_SYSTEMS_DIR` environment variable;
3. a search upward from the current working directory for a `simulator-systems/`
   directory containing a `registry.json`.

```python
import simulator_runtime
simulator_runtime.configure(packs_dir="/path/to/my-corpus")

from simulator_runtime.registry import list_simulator_contracts
from simulator_runtime.router import execute_simulator_tool

print(len(list_simulator_contracts()))           # systems in the corpus
res = execute_simulator_tool(
    "agent-1",
    {"name": "search_incidents", "simulator": {"system_id": "servicenow", "tool": "search_incidents"}},
    {"query": "payroll"},
)
print(res["status"], res["data"])
```

Or via the environment, from any directory:

```bash
GE_SIMULATOR_SYSTEMS_DIR=/path/to/my-corpus \
  python -c "import simulator_runtime; from simulator_runtime.registry import list_simulator_contracts; print(len(list_simulator_contracts()))"
```

## Determinism extras: virtual time, chaos profiles, record/replay

Three opt-in capabilities, each **off by default** (no env var, no contract field ⇒
byte-for-byte the behaviour described above) and **deterministic** (every draw is a
keyed BLAKE2b digest — never a salted `hash()` or an unseeded RNG — so the same call
sequence reproduces exactly across processes and machines).

- **Virtual clock** (`simulator_runtime.clock`) — enable with
  `GE_SIMULATOR_VIRTUAL_TIME=1` (global) or `virtualTime: true` on a contract.
  Simulation time starts at `GE_SIMULATOR_EPOCH` (ISO-8601, default
  `2026-01-01T09:00:00Z`) and advances 13–97 s per call, derived from the state key
  and call index. While enabled, audit events gain a deterministic `ts` stamp and
  per-tool `latency` injection **records** the sampled delay (audit detail
  `virtual_latency_ms=…`) instead of wall-sleeping, so time-shaped simulations run
  at full speed in tests. `clock.now_iso(ctx)` / `clock.advance(ctx, seconds=None)`
  are the API; clock state rides inside the same per-`agent:system:scenario` state
  document as everything else.

- **Chaos profiles** (`simulator_runtime.chaos`) — enable with
  `GE_SIMULATOR_CHAOS_PROFILE=<name>` (global) or `chaosProfile: "<name>"` on a
  contract (contract wins over env). Profiles: `steady` (labelled baseline, injects
  nothing), `brownout` (3× latency + timeouts), `storm` (heavy rate limiting +
  latency spikes), `flaky_dependency` (timeout/conflict bursts confined to
  deterministic call-index windows), `degraded_writes` (conflicts/validation errors
  on write tools; reads stay clean). Chaos composes with the existing weighted
  `failureModes` machinery as a second, independent draw keyed by
  `(agent, system, scenario, profile, call_index, tool)` — it never changes which
  contract-declared failures fire — and injected failures are audited with
  `detail="chaos:<profile>"`.

- **Record/replay cassettes** (`simulator_runtime.replay`) — set
  `GE_SIMULATOR_RECORD_DIR=<dir>` to append every router call (ok and error
  envelopes alike) to a human-readable `<dir>/<agent>__<system>.jsonl` cassette;
  set `GE_SIMULATOR_REPLAY_DIR=<dir>` to serve recorded envelopes (flagged
  `"replayed": true`) as the response. A replay hit still drives the live
  handler (its result is discarded) so simulator state — rows, approvals, the
  audit trail — advances exactly as it did while recording, keeping mixed
  hit/miss runs state-coherent; replay assumes the recording run's pack corpus
  and seeds. Calls are matched by a BLAKE2b
  fingerprint of the tool plus canonicalized args (volatile client tokens such as
  `idempotency_key`/`request_id`/`nonce` are excluded); repeated identical calls
  replay their responses in recorded order, and a miss **falls through to live
  execution** — a partial cassette degrades to a partial replay, never an error.
  With neither variable set there is zero file IO.

## Install

```bash
pip install -e packages/simulator-runtime              # core, zero third-party deps
pip install -e "packages/simulator-runtime[firestore]" # + durable Firestore backend
pip install -e "packages/simulator-runtime[alloydb]"   # + durable AlloyDB backend
```

## Public API

- `simulator_runtime.configure(packs_dir=..., repo_root=...)` / `set_packs_dir(...)`
- `simulator_runtime.packs_dir()`, `registry_path()`, `repo_root()`, `PACKS_DIR_ENV`
- `simulator_runtime.registry` — `get_simulator_contract`, `list_simulator_contracts`,
  `builtin_ids`, `reload`
- `simulator_runtime.router` — `execute_simulator_tool`, `is_simulator_tool`,
  `list_simulators`
- `simulator_runtime.overlay` — register/resolve runtime BYO packs
- `simulator_runtime.state_store` — `StateStore` protocol + memory/Firestore/AlloyDB
  implementations
```
