---
type: Agent Tool
title: lookup_system_dependency_mapper_runbook
description: "Look up sections of the System Dependency Mapper Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_system_dependency_mapper_runbook

Look up sections of the System Dependency Mapper Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Datadog APM](/systems/datadog-apm.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Datadog APM](/systems/datadog-apm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_discovery](/workflow/multi-source-discovery.md)
- [graph_analytics](/workflow/graph-analytics.md)
- [risk_reasoning](/workflow/risk-reasoning.md)

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_system_dependency_mapper_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Datadog APM](/systems/datadog-apm.md)
