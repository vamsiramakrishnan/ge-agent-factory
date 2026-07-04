---
type: Agent Tool
title: query_lexisnexis_risk_solutions_risk_reports
description: Retrieve risk reports from LexisNexis Risk Solutions for the Premium Leakage Detection Analyzer workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_lexisnexis_risk_solutions_risk_reports

Retrieve risk reports from LexisNexis Risk Solutions for the Premium Leakage Detection Analyzer workflow.

- **Kind:** query
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

## Inputs

- report_id
- policy_number
- date_range

## Outputs

- risk_reports_records
- risk_reports_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [exposure_intake_baseline_pull](/workflow/exposure-intake-baseline-pull.md)
- [pre_audit_findings_drafting](/workflow/pre-audit-findings-drafting.md)
- [recovery_publication_audit_trail](/workflow/recovery-publication-audit-trail.md)

## Evals

- [Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/premium-leakage-detection-analyzer-end-to-end.md)
- [Policy number 5541892 is queued for audit prioritization. mvr_records MVR-2277 (order date 2026-05-10) flags license_status 'suspended' with worst_violation_36mo 'dui_dwi', but prefill_datasets PF-0894 for the same quote_number 5541892 has match_confidence 0.58 and lists a prior_carrier that doesn't match the application. The linked risk_reports entry RPT-3310 has report_date 2026-05-28, more than 30 days old. Determine whether this qualifies as a premium leakage finding, and whether the evidence is sufficient to recommend an audit.](/tests/premium-leakage-detection-analyzer-mvr-prefill-reconciliation.md)
- [Policy 6602104: risk_reports RPT-4471 (report_type 'premium_audit_physical', report_date 2026-06-20) shows hazard_grade 'severe_referral_required' with open_recommendations 4. The linked prefill_datasets record PF-1583 for the same quote_number has fcra_adverse_action_triggered = true. The estimated recovery from this finding is $62,000 in additional annual premium. Walk through how you'd handle this audit case end to end.](/tests/premium-leakage-detection-analyzer-severe-hazard-fcra-escalation.md)

## Evidence emitted

- sql_result

## Required inputs

- report_id
- policy_number
- date_range

## Produces

- risk_reports_records
- risk_reports_summary

# Examples

```
query_lexisnexis_risk_solutions_risk_reports(report_id=<report_id>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
