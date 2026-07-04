---
type: Proof Obligation
title: "Golden eval obligation — The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it."
description: golden eval proof obligation
source_id: "eval-voice-of-customer-insights-analyzer-stale-evidence-threshold-edge"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [voice-of-customer-insights-analyzer-stale-evidence-threshold-edge](/tests/voice-of-customer-insights-analyzer-stale-evidence-threshold-edge.md)


## Mechanisms

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)

## Entities that must be referenced

- tickets
- satisfaction_scores
- product_catalog_entries
- session_events

## Forbidden behaviors

- Publishing the vendor-defect escalation using satisfaction_scores data older than the staleness threshold without flagging it
- Treating a borderline (2.1x) spike as an automatically confirmed defect cluster

# Citations

- [voice-of-customer-insights-analyzer-execution-playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)
- [voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook](/documents/voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook.md)
