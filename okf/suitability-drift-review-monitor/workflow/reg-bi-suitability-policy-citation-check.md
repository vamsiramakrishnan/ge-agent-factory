---
type: Workflow Stage
title: Reg BI / Suitability Policy Citation Check
description: "Run every flagged household through lookup_suitability_drift_review_monitor_compliance_policy to pull the governing Reg BI, concentration, and staleness sections before any finding is allowed to progress."
source_id: reg_bi_suitability_policy_citation_check
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reg BI / Suitability Policy Citation Check

Run every flagged household through lookup_suitability_drift_review_monitor_compliance_policy to pull the governing Reg BI, concentration, and staleness sections before any finding is allowed to progress.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

Next: [ServiceNow Review Case Triage & Assignment](/workflow/service-now-review-case-triage-assignment.md)
