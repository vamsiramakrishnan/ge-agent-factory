---
type: Eval Scenario
title: "Run the Competitive Win-Loss Analyzer workflow for the current period. Cite t..."
description: "Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "competitive-win-loss-analyzer-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)
- [action_salesforce_communications_cloud_recommend](/tools/action-salesforce-communications-cloud-recommend.md)

## Success rubric

Action recommend executed against Salesforce Communications Cloud, with audit-trail entry and Sales Operations Analyst notified of outcomes.

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
