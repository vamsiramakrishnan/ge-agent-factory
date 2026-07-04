---
type: Query Capability
title: "Review comments posted inline on the PR with severity levels. Auto-approve PR..."
description: "Review comments posted inline on the PR with severity levels. Auto-approve PRs with no issues; flag critical findings for human reviewer attention."
source_id: "comment-posting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Review comments posted inline on the PR with severity levels. Auto-approve PRs with no issues; flag critical findings for human reviewer attention.

## Tools used

- [lookup_code_review_assistant_runbook](/tools/lookup-code-review-assistant-runbook.md)

## Runs in

- [comment_posting](/workflow/comment-posting.md)

## Evidence expected

- document_reference

## Evals

- [Run the Code Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/code-review-assistant-end-to-end.md)

# Citations

- [Code Review Assistant Operations Runbook](/documents/code-review-assistant-runbook.md)
