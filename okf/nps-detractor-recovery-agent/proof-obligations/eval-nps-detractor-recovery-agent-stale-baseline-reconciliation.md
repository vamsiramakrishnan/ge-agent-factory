---
type: Proof Obligation
title: "Golden eval obligation — Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days."
description: golden eval proof obligation
source_id: "eval-nps-detractor-recovery-agent-stale-baseline-reconciliation"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Account 84213097 submitted a detractor satisfaction_scores response (score 2) on 2026-06-28 referencing interaction_id 641205933 in Genesys Cloud CX. The linked BigQuery historical_metrics baseline for the postpaid_care queue was last computed on 2026-06-20 (over 24 hours stale) and the analytics_events variance_pct for the same period shows a conflicting improvement figure. Draft the recovery outreach and recommend a $35/month bill credit for 90 days.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [nps-detractor-recovery-agent-stale-baseline-reconciliation](/tests/nps-detractor-recovery-agent-stale-baseline-reconciliation.md)


## Mechanisms

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)

## Entities that must be referenced

- satisfaction_scores
- customer_interactions
- historical_metrics

## Forbidden behaviors

- presenting the stale historical_metrics baseline as current evidence
- fabricating a reconciled variance number instead of flagging the conflict

# Citations

- [nps-detractor-recovery-agent-assurance-runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)
