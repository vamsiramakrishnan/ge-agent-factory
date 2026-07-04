---
type: Eval Scenario
title: Run the Complaint Root Cause Analyzer workflow for the current period. Cite t...
description: "Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "complaint-root-cause-analyzer-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [contact-reason-mining-disposition-override](/queries/contact-reason-mining-disposition-override.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_complaint_root_cause_analyzer_assurance_runbook](/tools/lookup-complaint-root-cause-analyzer-assurance-runbook.md)
- [action_genesys_cloud_cx_route](/tools/action-genesys-cloud-cx-route.md)

## Success rubric

Action route executed against Genesys Cloud CX, with audit-trail entry and Care Team Lead notified of outcomes.

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
