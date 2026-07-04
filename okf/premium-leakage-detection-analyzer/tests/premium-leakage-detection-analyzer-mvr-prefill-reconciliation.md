---
type: Eval Scenario
title: "Policy number 5541892 is queued for audit prioritization. mvr_records MVR-227..."
description: "Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit."
source_id: "premium-leakage-detection-analyzer-mvr-prefill-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit.

## Validates

- [exposure-intake-baseline-pull](/queries/exposure-intake-baseline-pull.md)

## Mechanisms to call

- [query_lexisnexis_risk_solutions_mvr_records](/tools/query-lexisnexis-risk-solutions-mvr-records.md)
- [query_lexisnexis_risk_solutions_prefill_datasets](/tools/query-lexisnexis-risk-solutions-prefill-datasets.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Premium Leakage Detection Analyzer Authority & Referral Guide](/documents/premium-leakage-detection-analyzer-authority-guide.md)
- [Physical Premium Audit Field Procedures & Classification Manual](/documents/premium-audit-field-procedures-manual.md)
