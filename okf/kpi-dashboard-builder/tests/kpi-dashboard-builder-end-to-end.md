---
type: Eval Scenario
title: Run the KPI Dashboard Builder workflow for the current period. Cite the relev...
description: "Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "kpi-dashboard-builder-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-ingestion](/queries/data-ingestion.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_kpi_dashboard_builder_controls_playbook](/tools/lookup-kpi-dashboard-builder-controls-playbook.md)
- [action_finance_3_route](/tools/action-finance-3-route.md)

## Success rubric

Action route executed against FINANCE 3, with audit-trail entry and Financial Reporting Manager notified of outcomes.

# Citations

- [KPI Dashboard Builder Controls Playbook](/documents/kpi-dashboard-builder-controls-playbook.md)
