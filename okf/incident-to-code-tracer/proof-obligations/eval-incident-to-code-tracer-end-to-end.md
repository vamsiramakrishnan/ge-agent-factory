---
type: Proof Obligation
title: "Golden eval obligation — Run the Incident-to-Code Tracer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-incident-to-code-tracer-end-to-end"
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

# Golden eval obligation — Run the Incident-to-Code Tracer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [incident-to-code-tracer-end-to-end](/tests/incident-to-code-tracer-end-to-end.md)


## Mechanisms

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_incident_to_code_tracer_runbook](/tools/lookup-incident-to-code-tracer-runbook.md)
- [action_github_recommend](/tools/action-github-recommend.md)

## Entities that must be referenced

- incidents
- alerts
- pull_requests
- issues
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [incident-to-code-tracer-runbook](/documents/incident-to-code-tracer-runbook.md)
