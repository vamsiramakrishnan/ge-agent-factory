---
type: Workflow Stage
title: "Coverage & Reserve-Line Cross-Check"
description: "Cross-reference claim_exposures.coverage_code (COLL_collision, COV_A_dwelling, BI_bodily_injury) against reserve_lines.reserve_type to confirm a liable third party exists and no subrogation_recovery_offset entry has already been set."
source_id: coverage_reserve_line_cross_check
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Reserve-Line Cross-Check

Cross-reference claim_exposures.coverage_code (COLL_collision, COV_A_dwelling, BI_bodily_injury) against reserve_lines.reserve_type to confirm a liable third party exists and no subrogation_recovery_offset entry has already been set.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

Next: [Recovery Likelihood & Expected-Value Scoring](/workflow/recovery-likelihood-expected-value-scoring.md)
