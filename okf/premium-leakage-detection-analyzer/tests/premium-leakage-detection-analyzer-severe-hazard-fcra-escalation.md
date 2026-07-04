---
type: Eval Scenario
title: "Policy 6602104: risk_reports RPT-4471 (report_type 'premium_audit_physical', ..."
description: "Policy 6602104: risk_reports RPT-4471 (report_type 'premium_audit_physical', report_date 2026-06-20) shows hazard_grade 'severe_referral_required' with open_recommendations 4. The linked prefill_datasets record PF-1583 for the same quote_number has fcra_adverse_action_triggered = true. The estimated recovery from this finding is $62,000 in additional annual premium. Walk through how you'd handle this audit case end to end."
source_id: "premium-leakage-detection-analyzer-severe-hazard-fcra-escalation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy 6602104: risk_reports RPT-4471 (report_type 'premium_audit_physical', report_date 2026-06-20) shows hazard_grade 'severe_referral_required' with open_recommendations 4. The linked prefill_datasets record PF-1583 for the same quote_number has fcra_adverse_action_triggered = true. The estimated recovery from this finding is $62,000 in additional annual premium. Walk through how you'd handle this audit case end to end.

## Validates

- [exposure-intake-baseline-pull](/queries/exposure-intake-baseline-pull.md)

## Mechanisms to call

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_lexisnexis_risk_solutions_prefill_datasets](/tools/query-lexisnexis-risk-solutions-prefill-datasets.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Premium Leakage Detection Analyzer Authority & Referral Guide](/documents/premium-leakage-detection-analyzer-authority-guide.md)
- [Physical Premium Audit Field Procedures & Classification Manual](/documents/premium-audit-field-procedures-manual.md)
