---
type: Eval Scenario
title: "Inspection lot 14582061 (material 452891) is running under skip-lot sampling...."
description: "Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?"
source_id: "batch-record-review-analyzer-skip-lot-fail-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?

## Validates

- [batch-closure-intake](/queries/batch-closure-intake.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Batch Record Review Analyzer Standard Operating Procedure](/documents/batch-record-review-analyzer-sop.md)
- [Electronic Batch Record & e-Signature Data Integrity Policy](/documents/batch-record-ebr-data-integrity-policy.md)
