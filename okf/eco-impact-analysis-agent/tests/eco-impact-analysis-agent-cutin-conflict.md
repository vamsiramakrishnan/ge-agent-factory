---
type: Eval Scenario
title: "ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effe..."
description: "ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date."
source_id: "eco-impact-analysis-agent-cutin-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date.

## Validates

- [eco-intake-classification](/queries/eco-intake-classification.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_ptc_windchill_plm_bom_revisions](/tools/query-ptc-windchill-plm-bom-revisions.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_sap_s_4hana_pp_material_stagings](/tools/query-sap-s-4hana-pp-material-stagings.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [ECO Impact Analysis Agent Standard Operating Procedure](/documents/eco-impact-analysis-agent-sop.md)
