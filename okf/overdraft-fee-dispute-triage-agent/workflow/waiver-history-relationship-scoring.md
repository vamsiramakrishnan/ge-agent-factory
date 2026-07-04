---
type: Workflow Stage
title: "Waiver History & Relationship Scoring"
description: "Query BigQuery analytics_events and historical_metrics for the account's trailing waiver count and relationship-depth signals, checked against the tier thresholds in the Courtesy Overdraft Fee Waiver Authority & Approval Limits Playbook."
source_id: waiver_history_relationship_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Waiver History & Relationship Scoring

Query BigQuery analytics_events and historical_metrics for the account's trailing waiver count and relationship-depth signals, checked against the tier thresholds in the Courtesy Overdraft Fee Waiver Authority & Approval Limits Playbook.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)

Next: [Policy-Gated Refund Determination](/workflow/policy-gated-refund-determination.md)
