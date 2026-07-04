---
type: Eval Scenario
title: Run the Vendor Rationalization Agent workflow for the current period. Cite th...
description: "Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "vendor-rationalization-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Vendor Rationalization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [telemetry-collection](/queries/telemetry-collection.md)

## Mechanisms to call

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_rationalization_agent_runbook](/tools/lookup-vendor-rationalization-agent-runbook.md)
- [action_servicenow_sam_recommend](/tools/action-servicenow-sam-recommend.md)

## Success rubric

Action recommend executed against ServiceNow SAM, with audit-trail entry and IT Procurement / Vendor Mgr notified of outcomes.

# Citations

- [Vendor Rationalization Agent Operations Runbook](/documents/vendor-rationalization-agent-runbook.md)
