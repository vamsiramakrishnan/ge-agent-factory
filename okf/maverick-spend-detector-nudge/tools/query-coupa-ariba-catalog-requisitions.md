---
type: Agent Tool
title: query_coupa_ariba_catalog_requisitions
description: "Retrieve requisitions from Coupa/Ariba Catalog for the Maverick Spend Detector & Nudge workflow."
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

# query_coupa_ariba_catalog_requisitions

Retrieve requisitions from Coupa/Ariba Catalog for the Maverick Spend Detector & Nudge workflow.

- **Kind:** query
- **Source system:** [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)

## Inputs

- lookup_key
- date_range

## Outputs

- requisitions_records
- requisitions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [off_contract_detection](/workflow/off-contract-detection.md)
- [root_cause_classification](/workflow/root-cause-classification.md)
- [personalized_nudge_generation](/workflow/personalized-nudge-generation.md)

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- requisitions_records
- requisitions_summary

# Examples

```
query_coupa_ariba_catalog_requisitions(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)
