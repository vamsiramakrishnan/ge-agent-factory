---
type: Eval Scenario
title: Run the Supplier Scorecard Generator workflow for the current period. Cite th...
description: "Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-scorecard-generator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [kpi-data-extraction](/queries/kpi-data-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records](/tools/query-sap-s-4hana-qm-mm-sap-s-4hana-qm-mm-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)
- [action_sap_s_4hana_qm_mm_generate](/tools/action-sap-s-4hana-qm-mm-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA QM/MM, with audit-trail entry and Supplier Relationship Manager notified of outcomes.

# Citations

- [Supplier Scorecard Generator Procurement Policy Guide](/documents/supplier-scorecard-generator-policy-guide.md)
