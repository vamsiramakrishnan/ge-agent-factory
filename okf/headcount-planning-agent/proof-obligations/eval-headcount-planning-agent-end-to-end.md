---
type: Proof Obligation
title: "Golden eval obligation — Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-headcount-planning-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [headcount-planning-agent-end-to-end](/tests/headcount-planning-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_headcount_planning_agent_controls_playbook](/tools/lookup-headcount-planning-agent-controls-playbook.md)
- [action_workday_sync](/tools/action-workday-sync.md)

## Entities that must be referenced

- employees
- budget_lines
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute sync without two-system evidence

# Citations

- [headcount-planning-agent-controls-playbook](/documents/headcount-planning-agent-controls-playbook.md)
