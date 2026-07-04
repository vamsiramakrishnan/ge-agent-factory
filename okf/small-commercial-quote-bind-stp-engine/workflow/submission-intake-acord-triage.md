---
type: Workflow Stage
title: "Submission Intake & ACORD Triage"
description: "Ingest new business submissions from Guidewire PolicyCenter's underwriting_submissions table, validating ACORD_125_commercial_app, ACORD_126_gl_section, ACORD_130_workers_comp, and ACORD_140_property_section forms plus NAICS code and producing broker appointment status before the risk enters the quote queue."
source_id: submission_intake_acord_triage
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission Intake & ACORD Triage

Ingest new business submissions from Guidewire PolicyCenter's underwriting_submissions table, validating ACORD_125_commercial_app, ACORD_126_gl_section, ACORD_130_workers_comp, and ACORD_140_property_section forms plus NAICS code and producing broker appointment status before the risk enters the quote queue.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

Next: [Eligibility & Appetite Screening](/workflow/eligibility-appetite-screening.md)
