---
type: Workflow Stage
title: "PR Intake & Diff Extraction"
description: "Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests."
source_id: pr_intake_diff_extraction
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# PR Intake & Diff Extraction

Receive PR webhook, extract diff, pull file context for changed files. Identify scope of changes — new files, modified functions, deleted tests.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_github_pull_requests](/tools/query-github-pull-requests.md)

Next: [Static & Security Analysis](/workflow/static-security-analysis.md)
