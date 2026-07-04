---
type: Agent Tool
title: query_nice_actimize_fraud_alerts
description: Retrieve fraud alerts from NICE Actimize for the Fraud Alert Triage Agent workflow.
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

Retrieve fraud alerts from NICE Actimize for the Fraud Alert Triage Agent workflow.

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

- [alert_intake_queue_prioritization](/workflow/alert-intake-queue-prioritization.md)
- [policy_evidence_gating](/workflow/policy-evidence-gating.md)
- [disposition_filing_case_handoff](/workflow/disposition-filing-case-handoff.md)

## Evals

- [Run the Fraud Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fraud-alert-triage-agent-end-to-end.md)
- [Alert 73482910 on account 48213077 was auto-dispositioned false_positive during initial triage, but the linked transaction_risk_scores record for this account shows score_band critical with mule_account_indicator true and velocity_rule_triggered true. Reconcile the two records, cite the amount_at_risk against the compliance policy thresholds, and recommend a disposition.](/tests/fraud-alert-triage-agent-conflicting-risk-signal.md)
- [Investigation case 2043981 has a filing_deadline_date of 2026-07-06 and sar_decision is still pending_review. The most recent NICE Actimize evidence pull for the linked fraud_alerts records is dated 2026-06-28. Today is 2026-07-04 -- can we file the SAR recommendation now, or does something need to happen first?](/tests/fraud-alert-triage-agent-stale-sar-deadline.md)

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
