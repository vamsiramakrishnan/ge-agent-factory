---
type: Agent Tool
title: query_lexisnexis_risk_solutions_risk_reports
description: Retrieve risk reports from LexisNexis Risk Solutions for the Submission Appetite Screening Agent workflow.
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

Retrieve risk reports from LexisNexis Risk Solutions for the Submission Appetite Screening Agent workflow.

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

- [loss_history_risk_enrichment](/workflow/loss-history-risk-enrichment.md)
- [desk_assignment_decline_drafting_audit_filing](/workflow/desk-assignment-decline-drafting-audit-filing.md)

## Evals

- [Run the Submission Appetite Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/submission-appetite-screening-agent-end-to-end.md)
- [Submission 48812 (ACORD_140_property_section, producing broker Meridian Coastal Insurance Agency, total_insured_value $6,250,000) shows loss_runs_received_5yr = false in Guidewire PolicyCenter, but the linked LexisNexis risk_reports record (report_id 90231) already shows hazard_grade severe_referral_required from a wind_mitigation_oir_b1_1802 inspection dated 2026-05-12. Can we clear this submission as in-appetite today, or what's blocking it?](/tests/submission-appetite-screening-agent-incomplete-loss-runs-severe-hazard.md)

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
