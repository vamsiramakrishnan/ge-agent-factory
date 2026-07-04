---
type: Workflow Stage
title: "Loss History & Risk Enrichment"
description: "For borderline submissions, pull risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to add hazard_grade, violation_points, and prior_losses_found context before an underwriter ever opens the file."
source_id: loss_history_risk_enrichment
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loss History & Risk Enrichment

For borderline submissions, pull risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to add hazard_grade, violation_points, and prior_losses_found context before an underwriter ever opens the file.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)

Next: [Referral, Authority & Sanctions Gating](/workflow/referral-authority-sanctions-gating.md)
