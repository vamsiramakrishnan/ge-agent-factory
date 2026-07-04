---
type: Workflow Stage
title: "Risk Tiering & Improvement-Plan Flagging"
description: "Score each vendor into a risk tier using nonconformance_records severity mix, capa_actions effectiveness_verified rate, and inspection_lots accepted_with_deviation frequency, citing control-limit thresholds from the Supplier Quality Scorecard Engine SOP and the Supplier Risk Classification Policy via lookup_supplier_quality_scorecard_engine_sop."
source_id: risk_tiering_improvement_plan_flagging
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk Tiering & Improvement-Plan Flagging

Score each vendor into a risk tier using nonconformance_records severity mix, capa_actions effectiveness_verified rate, and inspection_lots accepted_with_deviation frequency, citing control-limit thresholds from the Supplier Quality Scorecard Engine SOP and the Supplier Risk Classification Policy via lookup_supplier_quality_scorecard_engine_sop.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)

Next: [Scorecard Evidence Gate](/workflow/scorecard-evidence-gate.md)
