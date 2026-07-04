---
type: Eval Scenario
title: "Run the Requisition Intake & Smart Routing workflow for the current period. C..."
description: "Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "requisition-intake-smart-routing-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [requisition-ingestion](/queries/requisition-ingestion.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_me51n_purchase_orders](/tools/query-sap-s-4hana-mm-me51n-purchase-orders.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_oracle_oracle_records](/tools/query-oracle-oracle-records.md)
- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)
- [action_sap_s_4hana_mm_me51n_match](/tools/action-sap-s-4hana-mm-me51n-match.md)

## Success rubric

Action match executed against SAP S/4HANA MM (ME51N), with audit-trail entry and P2P Operations Manager notified of outcomes.

# Citations

- [Requisition Intake & Smart Routing Procurement Policy Guide](/documents/requisition-intake-smart-routing-policy-guide.md)
