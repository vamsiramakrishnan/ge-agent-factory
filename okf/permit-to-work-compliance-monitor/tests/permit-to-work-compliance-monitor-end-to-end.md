---
type: Eval Scenario
title: "Run the Permit-to-Work Compliance Monitor workflow for the current period. Ci..."
description: "Run the Permit-to-Work Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "permit-to-work-compliance-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Permit-to-Work Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [active-high-risk-work-permit-cross-check](/queries/active-high-risk-work-permit-cross-check.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)
- [action_sphera_ehs_generate](/tools/action-sphera-ehs-generate.md)

## Success rubric

Action generate executed against Sphera EHS, with audit-trail entry and EHS Manager notified of outcomes.

# Citations

- [Permit-to-Work Compliance Monitor Standard Operating Procedure](/documents/permit-to-work-compliance-monitor-sop.md)
