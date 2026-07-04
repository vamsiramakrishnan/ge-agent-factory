---
type: Proof Obligation
title: "Golden eval obligation — Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-change-risk-assessor-end-to-end"
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

# Golden eval obligation — Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [change-risk-assessor-end-to-end](/tests/change-risk-assessor-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Entities that must be referenced

- tickets
- issues
- pull_requests
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [change-risk-assessor-runbook](/documents/change-risk-assessor-runbook.md)
