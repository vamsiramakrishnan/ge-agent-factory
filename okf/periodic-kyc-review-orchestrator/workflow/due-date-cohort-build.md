---
type: Workflow Stage
title: "Due-Date Cohort Build"
description: "Query kyc_cases in Fenergo CLM by next_review_date and cdd_risk_rating to assemble this cycle's periodic-review cohort, sequencing overdue high-risk cases ahead of easy retail cases."
source_id: due_date_cohort_build
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Due-Date Cohort Build

Query kyc_cases in Fenergo CLM by next_review_date and cdd_risk_rating to assemble this cycle's periodic-review cohort, sequencing overdue high-risk cases ahead of easy retail cases.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [Activity-vs-Profile Comparison](/workflow/activity-vs-profile-comparison.md)
