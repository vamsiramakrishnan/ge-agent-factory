---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query shift_schedules, timecards, and labor_forecasts from UKG Dimensions (query_ukg_dimensions_shift_schedules) to establish which stores and shifts owed which corporate tasks this period.](/queries/task-schedule-pull.md)
- [Correlate reported task and promo-setup completion against Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries (query_oracle_xstore_pos_pos_transactions) to catch self-reported completions with no matching register activity.](/queries/pos-execution-cross-check.md)
- [Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events) to score the on-time completion and promo-verification gap and rank exceptions for the district queue.](/queries/baseline-variance-scoring.md)
- [Validate every scored exception against the Store Task Compliance Agent Retail Execution Playbook and the Verification & Evidence Sufficiency Standard (lookup_store_task_compliance_agent_execution_playbook) before any recommendation or escalation is drafted.](/queries/playbook-standard-evidence-gate.md)
- [Assemble the District Manager's per-store visit brief with exceptions, trends, and coaching points, and fire action_ukg_dimensions_escalate in UKG Dimensions with a full audit trail for any exception that clears the two-system evidence gate.](/queries/visit-brief-escalation.md)
