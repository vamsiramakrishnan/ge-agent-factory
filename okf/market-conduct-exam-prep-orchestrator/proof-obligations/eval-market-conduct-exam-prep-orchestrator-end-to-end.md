---
type: Proof Obligation
title: "Golden eval obligation — Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-market-conduct-exam-prep-orchestrator-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [market-conduct-exam-prep-orchestrator-end-to-end](/tests/market-conduct-exam-prep-orchestrator-end-to-end.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)
- [action_guidewire_policycenter_escalate](/tools/action-guidewire-policycenter-escalate.md)

## Entities that must be referenced

- policies
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [market-conduct-exam-prep-orchestrator-authority-guide](/documents/market-conduct-exam-prep-orchestrator-authority-guide.md)
