---
type: Eval Scenario
title: "Run the MRO & Facilities Optimization workflow for the current period. Cite t..."
description: "Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "mro-facilities-optimization-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [anomaly-interpretation-replenishment](/queries/anomaly-interpretation-replenishment.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_maximo_maximo_records](/tools/query-maximo-maximo-records.md)
- [query_emaint_emaint_records](/tools/query-emaint-emaint-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_mro_facilities_optimization_policy_guide](/tools/lookup-mro-facilities-optimization-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA MM, with audit-trail entry and Indirect Procurement Lead notified of outcomes.

# Citations

- [MRO & Facilities Optimization Procurement Policy Guide](/documents/mro-facilities-optimization-policy-guide.md)
