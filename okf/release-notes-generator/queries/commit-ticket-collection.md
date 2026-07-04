---
type: Query Capability
title: "Pull all commits since the last release tag from GitHub. Cross-reference comm..."
description: "Pull all commits since the last release tag from GitHub. Cross-reference commit messages with Jira tickets to enrich with story context and acceptance criteria."
source_id: "commit-ticket-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull all commits since the last release tag from GitHub. Cross-reference commit messages with Jira tickets to enrich with story context and acceptance criteria.

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_release_notes_generator_runbook](/tools/lookup-release-notes-generator-runbook.md)
- [action_github_release](/tools/action-github-release.md)

## Runs in

- [commit_ticket_collection](/workflow/commit-ticket-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/release-notes-generator-end-to-end.md)

# Citations

- [Release Notes Generator Operations Runbook](/documents/release-notes-generator-runbook.md)
