---
type: Eval Scenario
title: "Run the Engagement-to-Outcome Correlation Agent workflow for the current peri..."
description: "Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "engagement-to-outcome-correlation-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-integration](/queries/data-integration.md)

## Mechanisms to call

- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_finance_system_finance_system_records](/tools/query-finance-system-finance-system-records.md)
- [lookup_engagement_to_outcome_correlation_agent_policy_handbook](/tools/lookup-engagement-to-outcome-correlation-agent-policy-handbook.md)
- [action_culture_amp_execute](/tools/action-culture-amp-execute.md)

## Success rubric

Action execute executed against Culture Amp, with audit-trail entry and CHRO notified of outcomes.

# Citations

- [Engagement-to-Outcome Correlation Agent Policy Handbook](/documents/engagement-to-outcome-correlation-agent-policy-handbook.md)
