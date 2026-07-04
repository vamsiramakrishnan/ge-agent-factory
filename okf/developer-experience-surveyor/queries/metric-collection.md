---
type: Query Capability
title: "Aggregate DORA metrics from GitHub (deployment frequency, lead time for chang..."
description: "Aggregate DORA metrics from GitHub (deployment frequency, lead time for changes, change failure rate, MTTR). Pull developer sentiment from Slack channels and survey platforms."
source_id: "metric-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate DORA metrics from GitHub (deployment frequency, lead time for changes, change failure rate, MTTR). Pull developer sentiment from Slack channels and survey platforms.

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_developer_experience_surveyor_runbook](/tools/lookup-developer-experience-surveyor-runbook.md)
- [action_github_deploy](/tools/action-github-deploy.md)

## Runs in

- [metric_collection](/workflow/metric-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/developer-experience-surveyor-end-to-end.md)

# Citations

- [Developer Experience Surveyor Operations Runbook](/documents/developer-experience-surveyor-runbook.md)
