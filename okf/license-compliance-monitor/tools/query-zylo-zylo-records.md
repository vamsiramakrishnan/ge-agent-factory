---
type: Agent Tool
title: query_zylo_zylo_records
description: Retrieve zylo records from Zylo for the License Compliance Monitor workflow.
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

# query_zylo_zylo_records

Retrieve zylo records from Zylo for the License Compliance Monitor workflow.

- **Kind:** query
- **Source system:** [Zylo](/systems/zylo.md)

## Inputs

- lookup_key
- date_range

## Outputs

- zylo_records_records
- zylo_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Zylo](/systems/zylo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [entitlement_usage_merge](/workflow/entitlement-usage-merge.md)

## Evals

- [Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/license-compliance-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- zylo_records_records
- zylo_records_summary

# Examples

```
query_zylo_zylo_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Zylo](/systems/zylo.md)
