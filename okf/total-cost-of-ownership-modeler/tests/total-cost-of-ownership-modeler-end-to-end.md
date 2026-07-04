---
type: Eval Scenario
title: Run the Total Cost of Ownership Modeler workflow for the current period. Cite...
description: "Run the Total Cost of Ownership Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "total-cost-of-ownership-modeler-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Total Cost of Ownership Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [hidden-cost-discovery-narrative](/queries/hidden-cost-discovery-narrative.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_total_cost_of_ownership_modeler_policy_guide](/tools/lookup-total-cost-of-ownership-modeler-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Total Cost of Ownership Modeler Procurement Policy Guide](/documents/total-cost-of-ownership-modeler-policy-guide.md)
