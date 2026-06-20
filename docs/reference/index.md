---
title: Reference
nav_order: 3
layout: default
has_children: true
---

# Reference

Ground-truth reference for the GE Agent Factory — the commands, contracts, and
APIs that turn an enterprise use case into a generated, tested, deployable Gemini
Enterprise agent. Every command, flag, field, and endpoint on these pages exists
in the source tree; each page links back to the file it documents.

| Page | What it covers |
|---|---|
| [CLI](cli.html) | The `ge` CLI (`bun tools/ge.mjs`), the `ge-mock` generator CLI, and the `make` targets. |
| [Architecture](architecture.html) | The three planes, local vs remote mode, the durable control plane (ADR 0001), the run ledger, and the request/auth flow. |
| [Spec schema](spec-schema.html) | The use-case spec: `generationSpec`, `behaviorContract` (incl. `workflow`, `answerableQueries`, eval `mechanisms`), and `architecture.pipeline`. |
| [OKF](okf.html) | The Open Knowledge Format integration — concept types, the bundle layout, and the `spec-to-okf` / `okf-to-spec` converters. |
| [Agent generation](agent-generation.html) | What a generated agent looks like: real ADK, the three callbacks, the dual tool backend, multi-agent topology, the OKF grounding bundle, and the eval set. |
| [Simulator systems](simulator-systems.html) | The simulator engine: the pack contract, the generic runtime, the BYO layered registry + overlay, state backends, and the pack tooling. |
| [Console & APIs](console-and-apis.html) | The console views and the server API endpoints under `/api/ge/*`, `/api/runtime/*`, `/api/systems/*`, and `/api/interviews/:id/okf`. |
