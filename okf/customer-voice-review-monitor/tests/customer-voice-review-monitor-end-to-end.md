---
type: Eval Scenario
title: "Run the Customer Voice & Review Monitor workflow for the current period. Cite..."
description: "Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "customer-voice-review-monitor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [review-collection](/queries/review-collection.md)

## Mechanisms to call

- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_trustpilot_trustpilot_records](/tools/query-trustpilot-trustpilot-records.md)
- [query_gartner_peer_insights_gartner_peer_insights_records](/tools/query-gartner-peer-insights-gartner-peer-insights-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_customer_voice_review_monitor_playbook](/tools/lookup-customer-voice-review-monitor-playbook.md)
- [action_g2_draft](/tools/action-g2-draft.md)

## Success rubric

Action draft executed against G2, with audit-trail entry and Product Marketing Mgr notified of outcomes.

# Citations

- [Customer Voice & Review Monitor Playbook](/documents/customer-voice-review-monitor-playbook.md)
