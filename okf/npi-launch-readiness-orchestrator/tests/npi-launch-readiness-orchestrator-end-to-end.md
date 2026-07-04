---
type: Eval Scenario
title: Run the NPI Launch Readiness Orchestrator workflow for the current period. Ci...
description: "Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "npi-launch-readiness-orchestrator-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gate-deliverable-reconciliation](/queries/gate-deliverable-reconciliation.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Success rubric

Action escalate executed against PTC Windchill PLM, with audit-trail entry and NPI Program Manager notified of outcomes.

# Citations

- [NPI Launch Readiness Orchestrator Standard Operating Procedure](/documents/npi-launch-readiness-orchestrator-sop.md)
