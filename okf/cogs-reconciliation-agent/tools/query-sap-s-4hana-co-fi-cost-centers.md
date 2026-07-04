---
type: Agent Tool
title: query_sap_s_4hana_co_fi_cost_centers
description: Retrieve cost centers from SAP S/4HANA CO/FI for the COGS Reconciliation Agent workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_co_fi_cost_centers

Retrieve cost centers from SAP S/4HANA CO/FI for the COGS Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA CO/FI](/systems/sap-s-4hana-co-fi.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cost_centers_records
- cost_centers_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA CO/FI](/systems/sap-s-4hana-co-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [parallel_extraction](/workflow/parallel-extraction.md)

## Evals

- [Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cogs-reconciliation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cost_centers_records
- cost_centers_summary

# Examples

```
query_sap_s_4hana_co_fi_cost_centers(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA CO/FI](/systems/sap-s-4hana-co-fi.md)
