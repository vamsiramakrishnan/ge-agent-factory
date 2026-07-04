---
type: Agent Tool
title: query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records
description: "Retrieve citibank jp morgan commercial card records from Citibank/JP Morgan Commercial Card for the P-Card Reconciliation Agent workflow."
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

# query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records

Retrieve citibank jp morgan commercial card records from Citibank/JP Morgan Commercial Card for the P-Card Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)

## Inputs

- lookup_key
- date_range

## Outputs

- citibank_jp_morgan_commercial_card_records_records
- citibank_jp_morgan_commercial_card_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_ingestion](/workflow/transaction-ingestion.md)
- [auto_categorization_anomaly_detection](/workflow/auto-categorization-anomaly-detection.md)

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- citibank_jp_morgan_commercial_card_records_records
- citibank_jp_morgan_commercial_card_records_summary

# Examples

```
query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)
