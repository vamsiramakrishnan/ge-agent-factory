---
type: Proof Obligation
title: "Golden eval obligation — Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-engagement-to-outcome-correlation-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [engagement-to-outcome-correlation-agent-end-to-end](/tests/engagement-to-outcome-correlation-agent-end-to-end.md)


## Mechanisms

- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_finance_system_finance_system_records](/tools/query-finance-system-finance-system-records.md)
- [lookup_engagement_to_outcome_correlation_agent_policy_handbook](/tools/lookup-engagement-to-outcome-correlation-agent-policy-handbook.md)
- [action_culture_amp_execute](/tools/action-culture-amp-execute.md)

## Entities that must be referenced

- engagement_surveys
- employees
- analytics_events
- finance_system_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [engagement-to-outcome-correlation-agent-policy-handbook](/documents/engagement-to-outcome-correlation-agent-policy-handbook.md)
