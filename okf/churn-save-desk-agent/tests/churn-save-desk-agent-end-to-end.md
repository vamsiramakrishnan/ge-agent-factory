---
type: Eval Scenario
title: Run the Churn Save Desk Agent workflow for the current period. Cite the relev...
description: "Run the Churn Save Desk Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "churn-save-desk-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Churn Save Desk Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

## Success rubric

Action approve executed against Genesys Cloud CX, with audit-trail entry and Retention Marketing Manager notified of outcomes.

# Citations

- [Churn Save Desk Agent Service Assurance Runbook](/documents/churn-save-desk-agent-assurance-runbook.md)
