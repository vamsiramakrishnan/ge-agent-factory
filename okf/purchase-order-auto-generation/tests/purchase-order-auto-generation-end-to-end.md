---
type: Eval Scenario
title: "Run the Purchase Order Auto-Generation workflow for the current period. Cite ..."
description: "Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "purchase-order-auto-generation-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [po-generation-transmission](/queries/po-generation-transmission.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_me21n_purchase_orders](/tools/query-sap-s-4hana-mm-me21n-purchase-orders.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [lookup_purchase_order_auto_generation_policy_guide](/tools/lookup-purchase-order-auto-generation-policy-guide.md)
- [action_sap_s_4hana_mm_me21n_match](/tools/action-sap-s-4hana-mm-me21n-match.md)

## Success rubric

Action match executed against SAP S/4HANA MM (ME21N), with audit-trail entry and Buyer notified of outcomes.

# Citations

- [Purchase Order Auto-Generation Procurement Policy Guide](/documents/purchase-order-auto-generation-policy-guide.md)
