---
type: Query Capability
title: "Score technical debt using composite metric: code smells x change frequency x..."
description: "Score technical debt using composite metric: code smells x change frequency x incident correlation. Estimate refactoring ROI based on reduced incident rate and improved change velocity."
source_id: "debt-scoring-roi-estimation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score technical debt using composite metric: code smells x change frequency x incident correlation. Estimate refactoring ROI based on reduced incident rate and improved change velocity.

## Tools used

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_tech_debt_prioritizer_runbook](/tools/lookup-tech-debt-prioritizer-runbook.md)

## Runs in

- [debt_scoring_roi_estimation](/workflow/debt-scoring-roi-estimation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tech-debt-prioritizer-end-to-end.md)

# Citations

- [Tech Debt Prioritizer Operations Runbook](/documents/tech-debt-prioritizer-runbook.md)
