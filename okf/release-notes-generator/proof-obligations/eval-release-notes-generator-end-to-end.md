---
type: Proof Obligation
title: "Golden eval obligation — Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-release-notes-generator-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Release Notes Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [release-notes-generator-end-to-end](/tests/release-notes-generator-end-to-end.md)


## Mechanisms

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_release_notes_generator_runbook](/tools/lookup-release-notes-generator-runbook.md)
- [action_github_release](/tools/action-github-release.md)

## Entities that must be referenced

- pull_requests
- issues
- pages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute release without two-system evidence

# Citations

- [release-notes-generator-runbook](/documents/release-notes-generator-runbook.md)
