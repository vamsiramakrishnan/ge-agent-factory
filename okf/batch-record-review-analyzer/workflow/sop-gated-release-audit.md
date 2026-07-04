---
type: Workflow Stage
title: "SOP-Gated Release & Audit"
description: "Cite the governing batch-record-review-analyzer-sop and EBR data-integrity policy sections (lookup_batch_record_review_analyzer_sop), then execute action_sap_s_4hana_qm_recommend with a full audit_record_id trail, escalating per the escalation rules instead of auto-releasing."
source_id: sop_gated_release_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SOP-Gated Release & Audit

Cite the governing batch-record-review-analyzer-sop and EBR data-integrity policy sections (lookup_batch_record_review_analyzer_sop), then execute action_sap_s_4hana_qm_recommend with a full audit_record_id trail, escalating per the escalation rules instead of auto-releasing.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)
