---
type: Eval Scenario
title: Run the Release Notes Generator workflow for the current period. Cite the rel...
description: "Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "release-notes-generator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [commit-ticket-collection](/queries/commit-ticket-collection.md)

## Mechanisms to call

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_release_notes_generator_runbook](/tools/lookup-release-notes-generator-runbook.md)
- [action_github_release](/tools/action-github-release.md)

## Success rubric

Action release executed against GitHub, with audit-trail entry and DevOps Lead notified of outcomes.

# Citations

- [Release Notes Generator Operations Runbook](/documents/release-notes-generator-runbook.md)
