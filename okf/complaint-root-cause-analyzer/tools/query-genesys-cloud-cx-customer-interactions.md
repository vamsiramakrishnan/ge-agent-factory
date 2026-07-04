---
type: Agent Tool
title: query_genesys_cloud_cx_customer_interactions
description: Retrieve customer interactions from Genesys Cloud CX for the Complaint Root Cause Analyzer workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_genesys_cloud_cx_customer_interactions

Retrieve customer interactions from Genesys Cloud CX for the Complaint Root Cause Analyzer workflow.

- **Kind:** query
- **Source system:** [Genesys Cloud CX](/systems/genesys-cloud-cx.md)

## Inputs

- interaction_id
- account_number
- date_range

## Outputs

- customer_interactions_records
- customer_interactions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Genesys Cloud CX](/systems/genesys-cloud-cx.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/complaint-root-cause-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- interaction_id
- account_number
- date_range

## Produces

- customer_interactions_records
- customer_interactions_summary

# Examples

```
query_genesys_cloud_cx_customer_interactions(interaction_id=<interaction_id>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
