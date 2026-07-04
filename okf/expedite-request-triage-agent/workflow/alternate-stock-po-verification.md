---
type: Workflow Stage
title: "Alternate Stock & PO Verification"
description: "Check open purchase_orders and vendor standing in SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for existing coverage, alternate-plant supply, or a due_date that already beats the requested need — the evidence basis for rejecting an unnecessary expedite."
source_id: alternate_stock_po_verification
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alternate Stock & PO Verification

Check open purchase_orders and vendor standing in SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for existing coverage, alternate-plant supply, or a due_date that already beats the requested need — the evidence basis for rejecting an unnecessary expedite.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)
- [action_sap_s_4hana_mm_approve](/tools/action-sap-s-4hana-mm-approve.md)

Next: [Impact & Cost Scoring](/workflow/impact-cost-scoring.md)
