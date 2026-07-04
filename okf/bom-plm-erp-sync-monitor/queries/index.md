---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull released engineering_change_orders, bom_revisions, and cad_document_records from PTC Windchill PLM's overnight change queue for every material touched since the last successful sync.](/queries/nightly-eco-bom-extract.md)
- [Match Windchill bom_revisions component structures against SAP S/4HANA PP process_orders, work_center_confirmations, and material_stagings by material_number and order_number to find where the ERP structure has drifted.](/queries/erp-bom-correlation.md)
- [Classify each mismatch as failed interface transfer, manual ERP override, or pending change, cross-referencing BigQuery historical_metrics and analytics_events baselines to separate real drift from timing noise.](/queries/root-cause-classification.md)
- [Compare engineering_change_orders effectivity_date and effectivity_type against process_orders scheduled_start and material_stagings staging_due to flag parts with an imminent planned order still staged against a superseded bom_revisions record.](/queries/effectivity-build-risk-scoring.md)
- [Cite the BOM PLM-ERP Sync Monitor SOP and the CCB Effectivity & BOM Cut-In Policy via lookup_bom_plm_erp_sync_monitor_sop before any fix or disposition is recommended to the PLM Administrator.](/queries/sop-and-policy-evidence-gate.md)
- [Execute action_ptc_windchill_plm_escalate against PTC Windchill PLM with a full audit trail, routing unresolved effectivity or class-1 cases to change_analyst or chief_engineer.](/queries/escalate-audit-in-windchill.md)
