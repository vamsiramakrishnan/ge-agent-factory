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
