---
type: Query Capability
title: Release notes published to GitHub release page and Confluence. Internal chang...
description: Release notes published to GitHub release page and Confluence. Internal changelog with technical details distributed to engineering and support teams.
source_id: publication
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Release notes published to GitHub release page and Confluence. Internal changelog with technical details distributed to engineering and support teams.

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_release_notes_generator_runbook](/tools/lookup-release-notes-generator-runbook.md)
- [action_github_release](/tools/action-github-release.md)

## Runs in

- [publication](/workflow/publication.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/release-notes-generator-end-to-end.md)

# Citations

- [Release Notes Generator Operations Runbook](/documents/release-notes-generator-runbook.md)
