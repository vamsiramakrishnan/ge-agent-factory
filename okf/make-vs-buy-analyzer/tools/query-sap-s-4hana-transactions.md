---
type: Agent Tool
title: query_sap_s_4hana_transactions
description: "Retrieve transactions from SAP S/4HANA for the Make-vs-Buy Analyzer workflow."
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

# query_sap_s_4hana_transactions

Retrieve transactions from SAP S/4HANA for the Make-vs-Buy Analyzer workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA](/systems/sap-s-4hana.md)

## Inputs

- lookup_key
- date_range

## Outputs

- transactions_records
- transactions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s-4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_data_gathering](/workflow/cost-data-gathering.md)

## Evals

- [Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/make-vs-buy-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- transactions_records
- transactions_summary

# Examples

```
query_sap_s_4hana_transactions(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s-4hana.md)
