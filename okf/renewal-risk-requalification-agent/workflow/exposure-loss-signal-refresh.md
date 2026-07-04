---
type: Workflow Stage
title: "Exposure & Loss Signal Refresh"
description: "Pull current risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions (query_lexisnexis_risk_solutions_risk_reports) to refresh hazard_grade, worst_violation_36mo, and prior_losses_found against what was on file at the account's last renewal."
source_id: exposure_loss_signal_refresh
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exposure & Loss Signal Refresh

Pull current risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions (query_lexisnexis_risk_solutions_risk_reports) to refresh hazard_grade, worst_violation_36mo, and prior_losses_found against what was on file at the account's last renewal.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

Next: [Risk Delta Scoring & Baseline Comparison](/workflow/risk-delta-scoring-baseline-comparison.md)
