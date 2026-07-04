---
type: Workflow Stage
title: Case Reserve Philosophy Drift Check
description: "Track reserve_lines transaction_type mix, authority_level_used, and over_authority_referral flags against cached_aggregates baselines to detect case-reserving pattern shifts that distort paid-to-incurred ratios."
source_id: case_reserve_philosophy_drift_check
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case Reserve Philosophy Drift Check

Track reserve_lines transaction_type mix, authority_level_used, and over_authority_referral flags against cached_aggregates baselines to detect case-reserving pattern shifts that distort paid-to-incurred ratios.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)

Next: [Authority & Evidence Validation](/workflow/authority-evidence-validation.md)
