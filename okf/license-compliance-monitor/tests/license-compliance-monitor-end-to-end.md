---
type: Eval Scenario
title: Run the License Compliance Monitor workflow for the current period. Cite the ...
description: "Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "license-compliance-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [entitlement-usage-merge](/queries/entitlement-usage-merge.md)

## Mechanisms to call

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

## Success rubric

IT Procurement / Vendor Mgr receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [License Compliance Monitor Operations Runbook](/documents/license-compliance-monitor-runbook.md)
