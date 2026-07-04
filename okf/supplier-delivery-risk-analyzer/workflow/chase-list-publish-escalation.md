---
type: Workflow Stage
title: "Chase-List Publish & Escalation"
description: "Publish differentiated safety-stock recommendations and supplier reliability trends to Looker dashboards (query_looker_dashboards), execute action_sap_s_4hana_mm_publish with a full audit trail, and escalate exceptions to the Materials Manager."
source_id: chase_list_publish_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Chase-List Publish & Escalation

Publish differentiated safety-stock recommendations and supplier reliability trends to Looker dashboards (query_looker_dashboards), execute action_sap_s_4hana_mm_publish with a full audit trail, and escalate exceptions to the Materials Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)
- [action_sap_s_4hana_mm_publish](/tools/action-sap-s-4hana-mm-publish.md)
