---
type: Workflow Stage
title: "Commit & Ticket Collection"
description: "Pull all commits since the last release tag from GitHub. Cross-reference commit messages with Jira tickets to enrich with story context and acceptance criteria."
source_id: commit_ticket_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Commit & Ticket Collection

Pull all commits since the last release tag from GitHub. Cross-reference commit messages with Jira tickets to enrich with story context and acceptance criteria.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_release_notes_generator_runbook](/tools/lookup-release-notes-generator-runbook.md)
- [action_github_release](/tools/action-github-release.md)

Next: [Release Notes Generation](/workflow/release-notes-generation.md)
