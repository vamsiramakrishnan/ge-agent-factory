---
type: Proof Obligation
title: "Golden eval obligation — Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-it-budget-forecast-agent-end-to-end"
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

# Golden eval obligation — Run the IT Budget Forecast Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [it-budget-forecast-agent-end-to-end](/tests/it-budget-forecast-agent-end-to-end.md)


## Mechanisms

- [query_aws_cost_explorer_billing_records](/tools/query-aws-cost-explorer-billing-records.md)
- [query_gcp_billing_billing_records](/tools/query-gcp-billing-billing-records.md)
- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_it_budget_forecast_agent_runbook](/tools/lookup-it-budget-forecast-agent-runbook.md)

## Entities that must be referenced

- billing_records
- billing_records
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [it-budget-forecast-agent-runbook](/documents/it-budget-forecast-agent-runbook.md)
