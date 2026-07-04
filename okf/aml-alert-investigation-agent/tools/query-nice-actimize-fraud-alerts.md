---
type: Agent Tool
title: query_nice_actimize_fraud_alerts
description: Retrieve fraud alerts from NICE Actimize for the AML Alert Investigation Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_nice_actimize_fraud_alerts

Retrieve fraud alerts from NICE Actimize for the AML Alert Investigation Agent workflow.

- **Kind:** query
- **Source system:** [NICE Actimize](/systems/nice-actimize.md)

## Inputs

- alert_id
- account_number
- date_range

## Outputs

- fraud_alerts_records
- fraud_alerts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [NICE Actimize](/systems/nice-actimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_intake_case_binding](/workflow/alert-intake-case-binding.md)
- [transaction_counterparty_reconstruction](/workflow/transaction-counterparty-reconstruction.md)
- [typology_threshold_screening](/workflow/typology-threshold-screening.md)
- [filing_escalation_audit_handoff](/workflow/filing-escalation-audit-handoff.md)

## Evals

- [Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/aml-alert-investigation-agent-end-to-end.md)
- [Fraud alert 73452190 on account 48213590 has reg_e_claim_filed=true (the customer disputes the charges), but the transaction_risk_scores record for transaction 284910573621 on that same account shows mule_account_indicator=true and score_band='critical' as of 2026-06-29. Investigation case 2451087 is still open with sar_decision='pending_review'. Reconcile whether this is a victim Reg E claim or a mule account before recommending a disposition, and cite the governing policy sections.](/tests/aml-alert-investigation-agent-conflicting-signal-reconciliation.md)
- [Account 55871204 has three fraud_alerts entries (alert_type='business_email_compromise_wire') dated 2026-06-25, 2026-06-28, and 2026-06-30, with amount_at_risk of 8600.00, 9200.00, and 9750.00 spread across two branches. The most recent transaction_risk_scores record on file for that account is dated 2026-05-01. Investigation case 2287654's filing_deadline_date is 2026-07-06. Determine whether this triggers the structuring escalation and whether the SAR filing clock is at risk.](/tests/aml-alert-investigation-agent-structuring-stale-evidence.md)

## Evidence emitted

- source_system_record

## Required inputs

- alert_id
- account_number
- date_range

## Produces

- fraud_alerts_records
- fraud_alerts_summary

# Examples

```
query_nice_actimize_fraud_alerts(alert_id=<alert_id>, account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [NICE Actimize](/systems/nice-actimize.md)
