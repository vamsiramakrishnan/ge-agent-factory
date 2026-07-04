---
type: Workflow Stage
title: "Submission Intake & ACORD Data Capture"
description: "Ingest new underwriting_submissions as they land in Guidewire PolicyCenter, capturing acord_application_form, naics_code, total_insured_value, producing_broker, and loss_runs_received_5yr so screening can start within minutes of broker receipt instead of waiting for a desk to open the email."
source_id: submission_intake_acord_data_capture
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission Intake & ACORD Data Capture

Ingest new underwriting_submissions as they land in Guidewire PolicyCenter, capturing acord_application_form, naics_code, total_insured_value, producing_broker, and loss_runs_received_5yr so screening can start within minutes of broker receipt instead of waiting for a desk to open the email.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)

Next: [Appetite Matrix & Line-of-Business Screening](/workflow/appetite-matrix-line-of-business-screening.md)
