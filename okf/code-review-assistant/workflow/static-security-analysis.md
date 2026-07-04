---
type: Workflow Stage
title: "Static & Security Analysis"
description: "Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels."
source_id: static_security_analysis
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Static & Security Analysis

Run SonarQube analysis for code complexity, security pattern matching, test coverage gap analysis, and duplicate code detection. Map findings to severity levels.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

Next: [Contextual LLM Review](/workflow/contextual-llm-review.md)
