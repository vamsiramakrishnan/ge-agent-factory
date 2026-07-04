---
type: Eval Scenario
title: Run the Code Review Assistant workflow for the current period. Cite the relev...
description: "Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "code-review-assistant-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [static-security-analysis](/queries/static-security-analysis.md)

## Mechanisms to call

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gitlab_merge_requests](/tools/query-gitlab-merge-requests.md)
- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

## Success rubric

VP Engineering / DevOps Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Code Review Assistant Operations Runbook](/documents/code-review-assistant-runbook.md)
