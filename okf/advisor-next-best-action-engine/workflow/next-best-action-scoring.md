---
type: Workflow Stage
title: Next Best Action Scoring
description: "Rank households by attrition risk and opportunity size using BigQuery analytics_events and historical_metrics variance_pct, prioritizing the Relationship Manager's queue toward the top-decile clients."
source_id: next_best_action_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Next Best Action Scoring

Rank households by attrition risk and opportunity size using BigQuery analytics_events and historical_metrics variance_pct, prioritizing the Relationship Manager's queue toward the top-decile clients.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)

Next: [Evidence & Policy Citation Gate](/workflow/evidence-policy-citation-gate.md)
