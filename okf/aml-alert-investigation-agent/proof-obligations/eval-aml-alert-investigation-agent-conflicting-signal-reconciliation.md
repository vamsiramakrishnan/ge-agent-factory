---
type: Proof Obligation
title: "Golden eval obligation — Fraud alert 73452190 on account 48213590 has reg_e_claim_filed=true (the customer disputes the charges), but the transaction_risk_scores record for transaction 284910573621 on that same account shows mule_account_indicator=true and score_band='critical' as of 2026-06-29. Investigation case 2451087 is still open with sar_decision='pending_review'. Reconcile whether this is a victim Reg E claim or a mule account before recommending a disposition, and cite the governing policy sections."
description: golden eval proof obligation
source_id: "eval-aml-alert-investigation-agent-conflicting-signal-reconciliation"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Fraud alert 73452190 on account 48213590 has reg_e_claim_filed=true (the customer disputes the charges), but the transaction_risk_scores record for transaction 284910573621 on that same account shows mule_account_indicator=true and score_band='critical' as of 2026-06-29. Investigation case 2451087 is still open with sar_decision='pending_review'. Reconcile whether this is a victim Reg E claim or a mule account before recommending a disposition, and cite the governing policy sections.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [aml-alert-investigation-agent-conflicting-signal-reconciliation](/tests/aml-alert-investigation-agent-conflicting-signal-reconciliation.md)


## Mechanisms

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)

## Entities that must be referenced

- fraud_alerts
- transaction_risk_scores
- investigation_cases

## Forbidden behaviors

- closing case 2451087 as false_positive or reg_e_reimbursement without addressing the mule_account_indicator flag
- recommending a sar_decision without querying transaction_risk_scores evidence for transaction 284910573621

# Citations

- [aml-alert-investigation-agent-compliance-policy](/documents/aml-alert-investigation-agent-compliance-policy.md)
- [aml-alert-investigation-agent-sar-ctr-filing-runbook](/documents/aml-alert-investigation-agent-sar-ctr-filing-runbook.md)
