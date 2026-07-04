---
type: Workflow Stage
title: "Severity Scoring & SLA Check"
description: "Compare the ticket's age and priority against BigQuery historical_metrics and analytics_events baselines, flagging contacts at risk of missing sla_met before the SLA clock expires."
source_id: severity_scoring_sla_check
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity Scoring & SLA Check

Compare the ticket's age and priority against BigQuery historical_metrics and analytics_events baselines, flagging contacts at risk of missing sla_met before the SLA clock expires.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)

Next: [Policy-Gated Resolution](/workflow/policy-gated-resolution.md)
