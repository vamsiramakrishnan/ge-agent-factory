---
type: Workflow Stage
title: "Debt Scoring & ROI Estimation"
description: "Score technical debt using composite metric: code smells x change frequency x incident correlation. Estimate refactoring ROI based on reduced incident rate and improved change velocity."
source_id: debt_scoring_roi_estimation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Debt Scoring & ROI Estimation

Score technical debt using composite metric: code smells x change frequency x incident correlation. Estimate refactoring ROI based on reduced incident rate and improved change velocity.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_tech_debt_prioritizer_runbook](/tools/lookup-tech-debt-prioritizer-runbook.md)

Next: [Business Context Prioritization](/workflow/business-context-prioritization.md)
