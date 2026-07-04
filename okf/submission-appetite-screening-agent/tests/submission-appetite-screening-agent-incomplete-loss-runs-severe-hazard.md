---
type: Eval Scenario
title: "Submission 48812 (ACORD_140_property_section, producing broker Meridian Coast..."
description: "Submission 48812 (ACORD_140_property_section, producing broker Meridian Coastal Insurance Agency, total_insured_value $6,250,000) shows loss_runs_received_5yr = false in Guidewire PolicyCenter, but the linked LexisNexis risk_reports record (report_id 90231) already shows hazard_grade severe_referral_required from a wind_mitigation_oir_b1_1802 inspection dated 2026-05-12. Can we clear this submission as in-appetite today, or what's blocking it?"
source_id: "submission-appetite-screening-agent-incomplete-loss-runs-severe-hazard"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission 48812 (ACORD_140_property_section, producing broker Meridian Coastal Insurance Agency, total_insured_value $6,250,000) shows loss_runs_received_5yr = false in Guidewire PolicyCenter, but the linked LexisNexis risk_reports record (report_id 90231) already shows hazard_grade severe_referral_required from a wind_mitigation_oir_b1_1802 inspection dated 2026-05-12. Can we clear this submission as in-appetite today, or what's blocking it?

## Validates

- [desk-assignment-decline-drafting-audit-filing](/queries/desk-assignment-decline-drafting-audit-filing.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Submission Appetite Screening Agent Authority & Referral Guide](/documents/submission-appetite-screening-agent-authority-guide.md)
- [Coastal Wind & Catastrophe Aggregation Referral Playbook](/documents/coastal-wind-cat-referral-playbook.md)
