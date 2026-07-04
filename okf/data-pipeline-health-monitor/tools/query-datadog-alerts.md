---
type: Agent Tool
title: query_datadog_alerts
description: Retrieve alerts from Datadog for the Data Pipeline Health Monitor workflow.
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

# query_datadog_alerts

Retrieve alerts from Datadog for the Data Pipeline Health Monitor workflow.

- **Kind:** query
- **Source system:** [Datadog](/systems/datadog.md)

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

No explicit permission scopes declared; source-system access is tied to [Datadog](/systems/datadog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

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
query_datadog_alerts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Datadog](/systems/datadog.md)
