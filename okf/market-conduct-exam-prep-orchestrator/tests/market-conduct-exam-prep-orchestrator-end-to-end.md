---
type: Eval Scenario
title: Run the Market Conduct Exam Prep Orchestrator workflow for the current period...
description: "Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "market-conduct-exam-prep-orchestrator-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)
- [action_guidewire_policycenter_escalate](/tools/action-guidewire-policycenter-escalate.md)

## Success rubric

Action escalate executed against Guidewire PolicyCenter, with audit-trail entry and Regulatory Affairs Manager notified of outcomes.

# Citations

- [Market Conduct Exam Prep Orchestrator Authority & Referral Guide](/documents/market-conduct-exam-prep-orchestrator-authority-guide.md)
