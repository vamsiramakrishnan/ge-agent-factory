---
type: Workflow Stage
title: Scorecard Evidence Gate
description: "Cross-check every PPM movement, tier change, and improvement-plan recommendation against the governing SOP and the Risk Classification Policy before any narrative claim is issued, holding action_sap_s_4hana_qm_publish until two-system evidence is confirmed."
source_id: scorecard_evidence_gate
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scorecard Evidence Gate

Cross-check every PPM movement, tier change, and improvement-plan recommendation against the governing SOP and the Risk Classification Policy before any narrative claim is issued, holding action_sap_s_4hana_qm_publish until two-system evidence is confirmed.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)
- [action_sap_s_4hana_qm_publish](/tools/action-sap-s-4hana-qm-publish.md)

Next: [QBR Publish & Sourcing Handoff](/workflow/qbr-publish-sourcing-handoff.md)
