---
type: Agent Tool
title: query_sap_ariba_suppliers
description: "Retrieve suppliers from SAP Ariba for the Bid Evaluation & Scenario Analyzer workflow."
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

# query_sap_ariba_suppliers

Retrieve suppliers from SAP Ariba for the Bid Evaluation & Scenario Analyzer workflow.

- **Kind:** query
- **Source system:** [SAP Ariba](/systems/sap-ariba.md)

## Inputs

- lookup_key
- date_range

## Outputs

- suppliers_records
- suppliers_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba](/systems/sap-ariba.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [bid_collection_normalization](/workflow/bid-collection-normalization.md)

## Evals

- [Run the Bid Evaluation & Scenario Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bid-evaluation-scenario-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- suppliers_records
- suppliers_summary

# Examples

```
query_sap_ariba_suppliers(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP Ariba](/systems/sap-ariba.md)
