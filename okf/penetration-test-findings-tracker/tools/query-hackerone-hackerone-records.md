---
type: Agent Tool
title: query_hackerone_hackerone_records
description: Retrieve hackerone records from HackerOne for the Penetration Test Findings Tracker workflow.
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

# query_hackerone_hackerone_records

Retrieve hackerone records from HackerOne for the Penetration Test Findings Tracker workflow.

- **Kind:** query
- **Source system:** [HackerOne](/systems/hackerone.md)

## Inputs

- lookup_key
- date_range

## Outputs

- hackerone_records_records
- hackerone_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [HackerOne](/systems/hackerone.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Penetration Test Findings Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/penetration-test-findings-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- hackerone_records_records
- hackerone_records_summary

# Examples

```
query_hackerone_hackerone_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [HackerOne](/systems/hackerone.md)
