---
title: Simulators and BYO
parent: Concepts
nav_order: 4
layout: default
---

# Simulators and BYO

An enterprise agent is only as believable as the systems it talks to. The factory
gives every agent a **simulated source-system plane**: stateful stand-ins for
Workday, SAP Ariba, ServiceNow, BlackLine, and dozens more, so a generated agent
behaves as if it were wired into the real backends — without touching them.

## One generic engine, a corpus of systems

The simulators are **data-driven**, not hand-coded per system. A single generic
engine
([`apps/ge-demo-generator/mcp-service/simulator_runtime/`](https://github.com/vamsiramakrishnan/ge-agent-factory),
notably `generic.py`) executes any system described by a **simulator pack** — a
small set of declarative files under `simulator-systems/<id>/`:

| File | What it declares |
|---|---|
| `schema.json` | the entities/collections and their fields |
| `seed.json` | starting rows (referentially consistent) |
| `tools.json` | the tools the system exposes, with explicit bindings |
| `workflows.json` | state machines: transitions + approval gates |
| `projection.json` / `materialization.json` | how rows are shaped/derived |

The corpus (50+ systems — Workday, SAP S/4HANA FI/MM, Ariba, Concur, ServiceNow,
Salesforce, Coupa, BlackLine, GitHub, Jira, Datadog, …) is listed in
`simulator-systems/registry.json`. Because the engine is generic, adding a system
is adding *data*, not code, and the engine gives every system the same realistic
behavior: filtering, pagination, OData-style query controls, state transitions,
approval gates, idempotency, async jobs, and webhooks — all keyed per
agent/system/scenario so two agents never collide.

## BYO: synthesize a system you don't have a pack for

The headline capability is **Bring Your Own (BYO) system**: describe a system you
have — in natural language, by uploading **sample payloads**, or by handing over an
**OpenAPI spec** — and the factory *compiles* it into a live simulator and mounts
it immediately. No redeploy, no new code.

The pipeline (`mcp-service/synthesis.py`) is:

```
   description / samples / OpenAPI
            │
        sketch         compact intermediate: collections, primary keys,
            │          fields, optional per-collection state machine
            │          (NL via Vertex `global` with a strict schema +
            │           deterministic offline fallback; or inferred from
            │           samples / OpenAPI)
            ▼
        contract       full enriched contract the engine consumes:
            │          EXPLICIT tool bindings (no naming-convention guessing),
            │          workflows (transitions + gates), projection/materialization
            ▼
        seed           referentially-consistent rows (FK closure) + scenario-
            │          coverage rows so demos actually hit approval gates /
            │          invalid transitions
            ▼
        overlay        registered as an INLINE pack (no files) — resolvable
                       by the same generic engine immediately
```

The **runtime overlay** (`simulator_runtime/overlay.py`) is what turns the corpus
from a build-time artifact into a *runtime-instantiable* capability. Synthesized
packs are namespaced (e.g. `byo_partsledger`) so they never collide with built-in
systems, and resolution order is **overlay → built-in**. The overlay is in-memory
by default; set `GE_SIMULATOR_OVERLAY_BACKEND=firestore` (or `alloydb`) so every
Cloud Run instance resolves the same packs. A proven BYO system can be **promoted
into the corpus** as a normal pack. The console exposes this as a BYO UI.

## How agents actually call the simulators

The simulator plane is the *cloud-side* answer to the same question the
[fixtures](./agents-and-adk.html) answer offline — and both present the **same tool
names and result envelopes**, so a generated agent is unchanged across them:

```
   GE_DATA_BACKEND=fixtures (local / eval)
       agent ─▶ in-process FunctionTools ─▶ local fixture files

   GE_DATA_BACKEND=mcp (cloud)
       agent ─▶ MCP toolset (Agent Registry) ─▶ per-department FastMCP service
                                              ─▶ generic engine + agent's per-agent store
                                              ─▶ source-system envelope (looks like Workday/Ariba/SAP)
```

In the cloud, the custom per-department MCP service resolves `?agent=<id>`, loads
that agent's `mcp-tools.json`, and maps each tool's binding (`{op, store, entity,
key, sourceSystem}`) to an operation over the agent's per-agent store — wrapping
the result in a **source-system envelope**. That envelope (source system id,
evidence kind, audit trail) is exactly what the agent's evidence-capture callback
records and what its write-guard counts. So the simulators don't just return data;
they return data *shaped to make governance and citation work*. The identity and
transport details of that MCP plane are covered in
[Security and the Agent Gateway](./security-and-the-agent-gateway.html).

See the [Reference](../reference/) for the pack file formats and the MCP tool-plane
lifecycle, and the [Cookbooks](../cookbooks/) for "bring your own simulator".
