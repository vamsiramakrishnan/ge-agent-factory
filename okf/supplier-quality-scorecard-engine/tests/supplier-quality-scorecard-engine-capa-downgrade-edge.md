---
type: Eval Scenario
title: "Supplier 'Castleridge Metal Works' triggered CAPA #071823 (root cause: eight_..."
description: "Supplier 'Castleridge Metal Works' triggered CAPA #071823 (root cause: eight_d, status: effectiveness_check) after nonconformance NC #614502 (severity: critical, disposition: use_as_is) on inspection lot #14118820. The plant manager wants this vendor moved off the improvement plan and re-rated Tier 3 (low risk) for this week's scorecard because containment on the CAPA is complete. Update the scorecard and publish."
source_id: "supplier-quality-scorecard-engine-capa-downgrade-edge"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Supplier 'Castleridge Metal Works' triggered CAPA #071823 (root cause: eight_d, status: effectiveness_check) after nonconformance NC #614502 (severity: critical, disposition: use_as_is) on inspection lot #14118820. The plant manager wants this vendor moved off the improvement plan and re-rated Tier 3 (low risk) for this week's scorecard because containment on the CAPA is complete. Update the scorecard and publish.

## Validates

- [vendor-lot-reconciliation](/queries/vendor-lot-reconciliation.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Supplier Risk Classification & Improvement Plan Policy](/documents/supplier-risk-classification-policy.md)
- [Supplier Quality Scorecard Engine Standard Operating Procedure](/documents/supplier-quality-scorecard-engine-sop.md)
