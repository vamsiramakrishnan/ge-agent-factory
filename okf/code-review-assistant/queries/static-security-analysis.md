---
type: Query Capability
title: "Run SonarQube analysis for code complexity, security pattern matching, test c..."
description: "Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels."
source_id: "static-security-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels.

## Tools used

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

## Runs in

- [static_security_analysis](/workflow/static-security-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/code-review-assistant-end-to-end.md)

# Citations

- [Code Review Assistant Operations Runbook](/documents/code-review-assistant-runbook.md)
