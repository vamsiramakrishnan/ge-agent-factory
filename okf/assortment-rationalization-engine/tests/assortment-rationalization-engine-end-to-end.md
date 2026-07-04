---
type: Eval Scenario
title: Run the Assortment Rationalization Engine workflow for the current period. Ci...
description: "Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "assortment-rationalization-engine-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_assortment_rationalization_engine_execution_playbook](/tools/lookup-assortment-rationalization-engine-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

## Success rubric

Action route executed against Oracle Retail MFCS, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Assortment Rationalization Engine Retail Execution Playbook](/documents/assortment-rationalization-engine-execution-playbook.md)
