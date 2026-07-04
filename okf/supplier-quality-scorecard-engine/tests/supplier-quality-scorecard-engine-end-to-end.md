---
type: Eval Scenario
title: Run the Supplier Quality Scorecard Engine workflow for the current period. Ci...
description: "Run the Supplier Quality Scorecard Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-quality-scorecard-engine-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Supplier Quality Scorecard Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)
- [action_sap_s_4hana_qm_publish](/tools/action-sap-s-4hana-qm-publish.md)

## Success rubric

Action publish executed against SAP S/4HANA QM, with audit-trail entry and Supplier Quality Engineer notified of outcomes.

# Citations

- [Supplier Quality Scorecard Engine Standard Operating Procedure](/documents/supplier-quality-scorecard-engine-sop.md)
