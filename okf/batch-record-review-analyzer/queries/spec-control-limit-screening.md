---
type: Query Capability
title: Compare each quality_checks measured_value and cpk against lower_spec_limit/u...
description: "Compare each quality_checks measured_value and cpk against lower_spec_limit/upper_spec_limit, and check the inspection_lots aql_level, sample_size, and skip_lot flag, to isolate any characteristic reading outside its control limit before touching usage_decision."
source_id: "spec-control-limit-screening"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare each quality_checks measured_value and cpk against lower_spec_limit/upper_spec_limit, and check the inspection_lots aql_level, sample_size, and skip_lot flag, to isolate any characteristic reading outside its control limit before touching usage_decision.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)

## Runs in

- [spec_control_limit_screening](/workflow/spec-control-limit-screening.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Batch Record Review Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/batch-record-review-analyzer-end-to-end.md)
- [Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?](/tests/batch-record-review-analyzer-skip-lot-fail-conflict.md)
- [Nonconformance NC 642187 (severity critical, mrb_required true) was detected against material 452216 eleven days ago. The linked CAPA 74381 is still sitting in containment status and effectiveness_verified is false. Production wants inspection lot 14577903, same material, released today -- walk me through whether it's clear.](/tests/batch-record-review-analyzer-capa-effectiveness-gap.md)

# Citations

- [Batch Record Review Analyzer Standard Operating Procedure](/documents/batch-record-review-analyzer-sop.md)
- [Electronic Batch Record & e-Signature Data Integrity Policy](/documents/batch-record-ebr-data-integrity-policy.md)
