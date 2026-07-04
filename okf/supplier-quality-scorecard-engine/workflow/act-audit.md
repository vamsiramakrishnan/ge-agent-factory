---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Supplier Quality Engineer."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in SAP S/4HANA QM with a full audit trail, and escalate exceptions to the Supplier Quality Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)
- [action_sap_s_4hana_qm_publish](/tools/action-sap-s-4hana-qm-publish.md)
