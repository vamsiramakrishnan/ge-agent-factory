---
type: Eval Scenario
title: Run the Savings Pipeline Tracker workflow for the current period. Cite the re...
description: "Run the Savings Pipeline Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "savings-pipeline-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Savings Pipeline Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pipeline-data-ingestion](/queries/pipeline-data-ingestion.md)

## Mechanisms to call

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_savings_pipeline_tracker_policy_guide](/tools/lookup-savings-pipeline-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Success rubric

Action generate executed against Coupa, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Savings Pipeline Tracker Procurement Policy Guide](/documents/savings-pipeline-tracker-policy-guide.md)
