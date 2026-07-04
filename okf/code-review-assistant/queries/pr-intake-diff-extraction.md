---
type: Query Capability
title: "Receive PR webhook, extract diff, pull file context for changed files. Identi..."
description: "Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests."
source_id: "pr-intake-diff-extraction"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests.

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)

## Runs in

- [pr_intake_diff_extraction](/workflow/pr-intake-diff-extraction.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/code-review-assistant-end-to-end.md)

# Citations

- [Code Review Assistant Operations Runbook](/documents/code-review-assistant-runbook.md)
