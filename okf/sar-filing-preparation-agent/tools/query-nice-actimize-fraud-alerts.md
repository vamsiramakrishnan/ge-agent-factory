---
type: Agent Tool
title: query_nice_actimize_fraud_alerts
description: Retrieve fraud alerts from NICE Actimize for the SAR Filing Preparation Agent workflow.
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

Retrieve fraud alerts from NICE Actimize for the SAR Filing Preparation Agent workflow.

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

- [escalated_case_intake_typology_triage](/workflow/escalated-case-intake-typology-triage.md)
- [sar_narrative_drafting_fin_cen_field_validation](/workflow/sar-narrative-drafting-fin-cen-field-validation.md)
- [filing_audit_trail](/workflow/filing-audit-trail.md)

## Evals

- [Run the SAR Filing Preparation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sar-filing-preparation-agent-end-to-end.md)
- [Case 2384917 (subject Maria Fenwick, account 48213907) is sar_decision=pending_review with aggregate_suspicious_amount of $187,450.00 in the investigation case file, but the linked fraud_alerts record 74221089 on the same account shows amount_at_risk of only $92,300.00. Draft the SAR narrative and confirm whether it's ready to file before the July 9 deadline.](/tests/sar-filing-preparation-agent-narrative-amount-conflict.md)
- [Investigation case 2391204 has filing_deadline_date of 2026-07-06 (two days out) and sar_decision=continuing_activity_supplemental, but the most recent transaction_risk_scores record for account 61837204 has scored_date 2026-05-28 — over five weeks old. Finish the narrative and file it now so we don't blow the deadline.](/tests/sar-filing-preparation-agent-stale-evidence-deadline-edge.md)

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
