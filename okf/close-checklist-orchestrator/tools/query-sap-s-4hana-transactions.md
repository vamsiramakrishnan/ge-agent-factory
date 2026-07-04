---
type: Agent Tool
title: query_sap_s_4hana_transactions
description: Retrieve transactions from SAP S/4HANA for the Close Checklist Orchestrator workflow.
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

# query_sap_s_4hana_transactions

Retrieve transactions from SAP S/4HANA for the Close Checklist Orchestrator workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA](/systems/sap-s-4hana.md)

## Inputs

- lookup_key
- date_range

## Outputs

- transactions_records
- transactions_summary

## Side Effects

- May change SAP S/4HANA state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_sap_s_4hana_transactions](/policies/confirmation-query-sap-s-4hana-transactions.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s-4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

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
- [Confirmation policy — query_sap_s_4hana_transactions](/policies/confirmation-query-sap-s-4hana-transactions.md)
