---
type: Agent Tool
title: query_datadog_apm_alerts
description: Retrieve alerts from Datadog APM for the System Dependency Mapper workflow.
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

# query_datadog_apm_alerts

Retrieve alerts from Datadog APM for the System Dependency Mapper workflow.

- **Kind:** query
- **Source system:** [Datadog APM](/systems/datadog-apm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- alerts_records
- alerts_summary

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

## Evals

- [Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/system-dependency-mapper-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- alerts_records
- alerts_summary

# Examples

```
query_datadog_apm_alerts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Datadog APM](/systems/datadog-apm.md)
