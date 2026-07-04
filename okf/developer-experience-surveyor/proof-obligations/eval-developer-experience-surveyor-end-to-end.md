---
type: Proof Obligation
title: "Golden eval obligation — Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-developer-experience-surveyor-end-to-end"
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

# Golden eval obligation — Run the Developer Experience Surveyor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [developer-experience-surveyor-end-to-end](/tests/developer-experience-surveyor-end-to-end.md)


## Mechanisms

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_developer_experience_surveyor_runbook](/tools/lookup-developer-experience-surveyor-runbook.md)
- [action_github_deploy](/tools/action-github-deploy.md)

## Entities that must be referenced

- pull_requests
- issues
- messages
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute deploy without two-system evidence

# Citations

- [developer-experience-surveyor-runbook](/documents/developer-experience-surveyor-runbook.md)
