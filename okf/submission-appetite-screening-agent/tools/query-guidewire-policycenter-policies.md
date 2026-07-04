---
type: Agent Tool
title: query_guidewire_policycenter_policies
description: Retrieve policies from Guidewire PolicyCenter for the Submission Appetite Screening Agent workflow.
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

# query_guidewire_policycenter_policies

Retrieve policies from Guidewire PolicyCenter for the Submission Appetite Screening Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

## Inputs

- policy_number
- named_insured
- date_range

## Outputs

- policies_records
- policies_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [submission_intake_acord_data_capture](/workflow/submission-intake-acord-data-capture.md)
- [appetite_matrix_line_of_business_screening](/workflow/appetite-matrix-line-of-business-screening.md)
- [desk_assignment_decline_drafting_audit_filing](/workflow/desk-assignment-decline-drafting-audit-filing.md)

## Evals

- [Run the Submission Appetite Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/submission-appetite-screening-agent-end-to-end.md)
- [Submission 48812 (ACORD_140_property_section, producing broker Meridian Coastal Insurance Agency, total_insured_value $6,250,000) shows loss_runs_received_5yr = false in Guidewire PolicyCenter, but the linked LexisNexis risk_reports record (report_id 90231) already shows hazard_grade severe_referral_required from a wind_mitigation_oir_b1_1802 inspection dated 2026-05-12. Can we clear this submission as in-appetite today, or what's blocking it?](/tests/submission-appetite-screening-agent-incomplete-loss-runs-severe-hazard.md)
- [Submission 51190 (insured Harbor Ridge Manufacturing LLC, NAICS 332312, ACORD_125_commercial_app) lists total_insured_value of $24,800,000 in Guidewire PolicyCenter as of 2026-07-01, but the broker's cover letter references a revised property schedule that would push TIV to $26,100,000. The BigQuery analytics_events snapshot used for the turnaround KPI is dated 2026-06-20. Screen this submission and tell me if it's in appetite.](/tests/submission-appetite-screening-agent-tiv-threshold-stale-evidence.md)

## Evidence emitted

- source_system_record

## Required inputs

- policy_number
- named_insured
- date_range

## Produces

- policies_records
- policies_summary

# Examples

```
query_guidewire_policycenter_policies(policy_number=<policy_number>, named_insured=<named_insured>, date_range=<date_range>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
