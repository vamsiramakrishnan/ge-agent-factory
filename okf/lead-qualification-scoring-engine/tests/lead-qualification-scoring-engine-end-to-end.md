---
type: Eval Scenario
title: Run the Lead Qualification Scoring Engine workflow for the current period. Ci...
description: "Run the Lead Qualification Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "lead-qualification-scoring-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Lead Qualification Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [lead-intake-serviceability-check](/queries/lead-intake-serviceability-check.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

## Success rubric

Action route executed against Salesforce Communications Cloud, with audit-trail entry and Inside Sales Representative notified of outcomes.

# Citations

- [Lead Qualification Scoring Engine Service Assurance Runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
