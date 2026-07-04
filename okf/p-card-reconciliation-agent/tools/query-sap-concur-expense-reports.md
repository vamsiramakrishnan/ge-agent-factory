---
type: Agent Tool
title: query_sap_concur_expense_reports
description: "Retrieve expense reports from SAP Concur for the P-Card Reconciliation Agent workflow."
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

# query_sap_concur_expense_reports

Retrieve expense reports from SAP Concur for the P-Card Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [SAP Concur](/systems/sap-concur.md)

## Inputs

- lookup_key
- date_range

## Outputs

- expense_reports_records
- expense_reports_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Concur](/systems/sap-concur.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [transaction_ingestion](/workflow/transaction-ingestion.md)
- [llm_interpretation_policy_validation](/workflow/llm-interpretation-policy-validation.md)

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- expense_reports_records
- expense_reports_summary

# Examples

```
query_sap_concur_expense_reports(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP Concur](/systems/sap-concur.md)
