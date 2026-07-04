---
type: Query Capability
title: "Generate the defect-elimination candidate briefing with projected savings, pu..."
description: "Generate the defect-elimination candidate briefing with projected savings, publish the ranking to Looker dashboards, and execute action_ibm_maximo_publish in IBM Maximo with a full audit trail, escalating exceptions to the Reliability Engineer."
source_id: "defect-elimination-briefing-and-publish"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Generate the defect-elimination candidate briefing with projected savings, publish the ranking to Looker dashboards, and execute action_ibm_maximo_publish in IBM Maximo with a full audit trail, escalating exceptions to the Reliability Engineer.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)

## Runs in

- [defect_elimination_briefing_and_publish](/workflow/defect-elimination-briefing-and-publish.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bad-actor-asset-analyzer-end-to-end.md)
- [Asset 148203 is ranked #1 by repair cost this quarter in maintenance_work_orders ($142,500 across 6 work orders) but shows only 40 minutes of downtime_events in OSIsoft PI System for the same period, while asset 151877 has 2,340 minutes of downtime but only $18,000 in work order cost. Reconcile which one is the real top bad actor and explain the discrepancy before publishing the ranking to Looker.](/tests/bad-actor-asset-analyzer-index-reconciliation.md)
- [Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?](/tests/bad-actor-asset-analyzer-thin-history-flag.md)

# Citations

- [Bad Actor Asset Analyzer Standard Operating Procedure](/documents/bad-actor-asset-analyzer-sop.md)
- [Asset Criticality Ranking & ISO 10816/20816 Vibration Severity Playbook](/documents/bad-actor-asset-analyzer-criticality-vibration-playbook.md)
