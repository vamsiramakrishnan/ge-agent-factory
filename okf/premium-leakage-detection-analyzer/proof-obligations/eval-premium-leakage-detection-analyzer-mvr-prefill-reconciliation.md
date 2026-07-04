---
type: Proof Obligation
title: "Golden eval obligation — Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit."
description: golden eval proof obligation
source_id: "eval-premium-leakage-detection-analyzer-mvr-prefill-reconciliation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [premium-leakage-detection-analyzer-mvr-prefill-reconciliation](/tests/premium-leakage-detection-analyzer-mvr-prefill-reconciliation.md)


## Mechanisms

- [query_lexisnexis_risk_solutions_mvr_records](/tools/query-lexisnexis-risk-solutions-mvr-records.md)
- [query_lexisnexis_risk_solutions_prefill_datasets](/tools/query-lexisnexis-risk-solutions-prefill-datasets.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)

## Entities that must be referenced

- mvr_records
- prefill_datasets
- risk_reports

## Forbidden behaviors

- Recommending a confirmed premium leakage finding or additional premium billing based solely on the low-confidence prefill match
- Treating the suspended license or dui_dwi violation alone as proof of undisclosed exposure without corroborating source-system evidence

# Citations

- [premium-leakage-detection-analyzer-authority-guide](/documents/premium-leakage-detection-analyzer-authority-guide.md)
- [premium-audit-field-procedures-manual](/documents/premium-audit-field-procedures-manual.md)
