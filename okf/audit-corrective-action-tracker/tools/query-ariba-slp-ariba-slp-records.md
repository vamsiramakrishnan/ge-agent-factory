---
type: Agent Tool
title: query_ariba_slp_ariba_slp_records
description: "Retrieve ariba slp records from Ariba SLP for the Audit & Corrective Action Tracker workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ariba_slp_ariba_slp_records

Retrieve ariba slp records from Ariba SLP for the Audit & Corrective Action Tracker workflow.

- **Kind:** query
- **Source system:** [Ariba SLP](/systems/ariba-slp.md)

## Inputs

- lookup_key
- date_range

## Outputs

- ariba_slp_records_records
- ariba_slp_records_summary

## Side Effects

- May change Ariba SLP state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_ariba_slp_ariba_slp_records](/policies/confirmation-query-ariba-slp-ariba-slp-records.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ariba SLP](/systems/ariba-slp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- ariba_slp_records_records
- ariba_slp_records_summary

# Examples

```
query_ariba_slp_ariba_slp_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Ariba SLP](/systems/ariba-slp.md)
- [Confirmation policy — query_ariba_slp_ariba_slp_records](/policies/confirmation-query-ariba-slp-ariba-slp-records.md)
