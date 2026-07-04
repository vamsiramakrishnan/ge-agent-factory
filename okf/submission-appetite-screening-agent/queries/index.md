---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest new underwriting_submissions as they land in Guidewire PolicyCenter, capturing acord_application_form, naics_code, total_insured_value, producing_broker, and loss_runs_received_5yr so screening can start within minutes of broker receipt instead of waiting for a desk to open the email.](/queries/submission-intake-acord-data-capture.md)
- [Score policies and policy_quotes attributes (line_of_business, jurisdiction_state, underwriting_tier) against the current appetite bands defined in the Submission Appetite Screening Agent Authority & Referral Guide to sort each submission into clear in-appetite, clear decline, or borderline.](/queries/appetite-matrix-line-of-business-screening.md)
- [For borderline submissions, pull risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to add hazard_grade, violation_points, and prior_losses_found context before an underwriter ever opens the file.](/queries/loss-history-risk-enrichment.md)
- [Cross-check total_insured_value and requested limits against the letter-of-authority grid and OFAC/coastal wind-pool triggers in the Authority & Referral Guide and the Coastal Wind & Catastrophe Aggregation Referral Playbook, gating anything above threshold before a disposition is issued.](/queries/referral-authority-sanctions-gating.md)
- [Execute action_guidewire_policycenter_file to route in-appetite submissions to the assigned_underwriter's desk or draft the decline letter for submission_status = declined_appetite risk, logging generated_audit_trail on every disposition.](/queries/desk-assignment-decline-drafting-audit-filing.md)
