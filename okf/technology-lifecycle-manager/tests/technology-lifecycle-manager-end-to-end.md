---
type: Eval Scenario
title: Run the Technology Lifecycle Manager workflow for the current period. Cite th...
description: "Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "technology-lifecycle-manager-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [technology-census](/queries/technology-census.md)

## Mechanisms to call

- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_leanix_leanix_records](/tools/query-leanix-leanix-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_technology_lifecycle_manager_runbook](/tools/lookup-technology-lifecycle-manager-runbook.md)
- [action_servicenow_cmdb_generate](/tools/action-servicenow-cmdb-generate.md)

## Success rubric

Action generate executed against ServiceNow CMDB, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [Technology Lifecycle Manager Operations Runbook](/documents/technology-lifecycle-manager-runbook.md)
